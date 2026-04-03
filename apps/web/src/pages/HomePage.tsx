import { useEffect, useMemo, useRef, useState } from 'react';
import type { ScanRequest, ScanResponse, ScanResult, StrategyRecord } from '@gate-screener/shared-types';
import { SymbolDetailChart } from '@/components/charts/SymbolDetailChart';
import { ChangeFilterPanel } from '@/components/filters/ChangeFilterPanel';
import { IndicatorFilterPanel } from '@/components/filters/IndicatorFilterPanel';
import { MarketBasicFilters } from '@/components/filters/MarketBasicFilters';
import { MovingAverageFilterPanel } from '@/components/filters/MovingAverageFilterPanel';
import { PatternFilterPanel } from '@/components/filters/PatternFilterPanel';
import { TopActionBar } from '@/components/layout/TopActionBar';
import { ScanResultTable } from '@/components/results/ScanResultTable';
import { deleteStrategy, listStrategies, saveStrategy, scanMarket } from '@/services/api';
import { applyCommonTrendPreset, createDefaultRequest, normalizeRequest } from '@/store/defaults';
import { buildSelectedConditionTags } from '@/utils/summary';

export function HomePage() {
  const [request, setRequest] = useState<ScanRequest>(createDefaultRequest);
  const [response, setResponse] = useState<ScanResponse | null>(null);
  const [selectedResult, setSelectedResult] = useState<ScanResult | undefined>();
  const [strategies, setStrategies] = useState<StrategyRecord[]>([]);
  const [hasScanned, setHasScanned] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const resultSectionRef = useRef<HTMLElement | null>(null);

  const tags = useMemo(() => buildSelectedConditionTags(request), [request]);

  useEffect(() => {
    void loadStrategies();
  }, []);

  async function loadStrategies() {
    try {
      const items = await listStrategies();
      setStrategies(items.map((item) => ({ ...item, request: normalizeRequest(item.request) })));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : '读取策略失败');
    }
  }

  function scrollToResults() {
    window.requestAnimationFrame(() => {
      resultSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  }

  async function handleScan() {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setHasScanned(true);
      setScanning(true);
      setError(null);
      setResponse(null);
      setSelectedResult(undefined);
      scrollToResults();

      const nextResponse = await scanMarket(request, controller.signal);
      setResponse(nextResponse);
      setSelectedResult(nextResponse.results[0]);
      scrollToResults();
    } catch (scanError) {
      if (scanError instanceof DOMException && scanError.name === 'AbortError') {
        return;
      }

      setError(scanError instanceof Error ? scanError.message : '扫描失败');
      scrollToResults();
    } finally {
      setScanning(false);
    }
  }

  async function handleSave() {
    const name = window.prompt('请输入策略名称');
    if (!name) {
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await saveStrategy(name, request);
      await loadStrategies();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : '保存策略失败');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteStrategy(strategy: StrategyRecord) {
    const confirmed = window.confirm(`确定删除策略“${strategy.name}”吗？`);
    if (!confirmed) {
      return;
    }

    try {
      await deleteStrategy(strategy.id);
      await loadStrategies();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : '删除策略失败');
    }
  }

  return (
    <main className="page-shell">
      <TopActionBar
        tags={tags}
        scanning={scanning || saving}
        strategies={strategies}
        onScan={handleScan}
        onReset={() => {
          abortControllerRef.current?.abort();
          setRequest(createDefaultRequest());
          setResponse(null);
          setSelectedResult(undefined);
          setHasScanned(false);
          setError(null);
        }}
        onSave={handleSave}
        onLoadStrategy={(strategy) => {
          setRequest(normalizeRequest(strategy.request));
          setResponse(null);
          setSelectedResult(undefined);
          setHasScanned(false);
          setError(null);
        }}
        onDeleteStrategy={handleDeleteStrategy}
        onRemoveTag={(tag) => {
          setRequest((currentRequest) => tag.remove(currentRequest));
          setResponse(null);
          setSelectedResult(undefined);
          setHasScanned(false);
        }}
      />

      <div className="stacked-sections">
        <MarketBasicFilters request={request} onChange={setRequest} />
        <MovingAverageFilterPanel
          request={request}
          onChange={setRequest}
          onApplyCommonPreset={() => {
            setRequest((currentRequest) => applyCommonTrendPreset(currentRequest));
            setResponse(null);
            setSelectedResult(undefined);
            setHasScanned(false);
            setError(null);
          }}
        />
        <IndicatorFilterPanel request={request} onChange={setRequest} />
        <ChangeFilterPanel request={request} onChange={setRequest} />
        <PatternFilterPanel request={request} onChange={setRequest} />

        <section ref={resultSectionRef} className="card result-section">
          <div className="section-heading section-heading--split">
            <div>
              <h2>扫描结果</h2>
            </div>

            <div className="result-meta">
              <span>{scanning ? '扫描中...' : `候选 ${response?.candidates ?? 0}`}</span>
              <span>{`命中 ${response?.matched ?? 0}`}</span>
              <span>{response ? `${response.durationMs} ms` : '等待扫描'}</span>
            </div>
          </div>

          {error ? <div className="error-banner">{error}</div> : null}
          {!error && scanning ? (
            <div className="info-banner info-banner--progress">
              正在扫描，请稍等几秒，系统正在拉取市场数据并匹配条件。
            </div>
          ) : null}
          {!error && !scanning && hasScanned && response && response.matched === 0 ? (
            <div className="info-banner">本次扫描已完成，但没有命中结果。可以放宽条件后再试一次。</div>
          ) : null}

          <div className="result-layout">
            <div className="result-layout__table">
              <ScanResultTable
                scanning={scanning}
                hasScanned={hasScanned}
                results={response?.results ?? []}
                selectedContract={selectedResult?.contract}
                onSelect={setSelectedResult}
              />
            </div>

            <div className="result-layout__chart">
              <SymbolDetailChart result={selectedResult} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
