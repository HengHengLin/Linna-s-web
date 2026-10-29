// Provider-owned display only. No extraction/redistribution of third-party quotes.
export const marketWidgetConfig={
 colorTheme:'light',dateRange:'1M',locale:'zh_CN',width:'100%',height:520,
 isTransparent:false,showChart:true,showSymbolLogo:false,showFloatingTooltip:true,
 tabs:[{title:'A 股与香港 · 收盘指数',symbols:[
  {s:'SSE:000001',d:'上证指数 · 000001'},
  {s:'SSE:000300',d:'沪深300 · 000300'},
  {s:'SSE:000688',d:'科创50 · 000688'},
  {s:'SZSE:399006',d:'创业板指 · 399006'},
  {s:'HSI:HSI',d:'恒生指数 · HSI'}
 ],originalTitle:'Indices'}]
};
export const marketLicense={
 provider:'TradingView',mode:'最近收盘 / EOD，非实时',
 documentation:'https://www.tradingview.com/widget-docs/widgets/watchlists/market-overview/',
 availability:'https://www.tradingview.com/widget-docs/markets/asia-pacific/',
 faq:'https://www.tradingview.com/widget-docs/faq/data/',
 reviewedAt:'2026-10-28'
};
