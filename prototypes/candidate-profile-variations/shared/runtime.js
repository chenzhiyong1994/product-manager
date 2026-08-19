(() => {
  const q = (s, root = document) => root.querySelector(s);
  const qa = (s, root = document) => [...root.querySelectorAll(s)];
  const current = document.body.dataset.version || "";
  const roots = current === "V1" ? "." : "..";
  const versionLinks = [
    ["V1", "../../candidate-profile-workbench/index.html"],
    ["V2", "../v02-decision-cockpit/index.html"], ["V3", "../v03-profile-orbit/index.html"],
    ["V4", "../v04-evidence-timeline/index.html"], ["V5", "../v05-question-radar/index.html"],
    ["V6", "../v06-consensus-board/index.html"], ["V7", "../v07-plan-sandbox/index.html"],
    ["V8", "../v08-data-flow-map/index.html"], ["V9", "../v09-modular-desk/index.html"],
    ["V10", "../v10-editorial-dossier/index.html"]
  ];

  document.body.insertAdjacentHTML("beforeend", `
    <nav class="vx-version-bar" aria-label="原型版本切换">
      <a href="../index.html">十版对比</a>
      ${versionLinks.map(([label, href]) => `<a href="${href}" class="${label === current ? "active" : ""}">${label.replace("V", "")}</a>`).join("")}
    </nav>
    <div class="vx-backdrop" data-vx-close></div>
    <aside class="vx-drawer" id="vxDrawer" aria-hidden="true">
      <header class="vx-drawer-head"><div><span class="vx-kicker" id="vxDimension">画像证据</span><h2 id="vxTitle">标签详情</h2></div><button class="vx-close" data-vx-close aria-label="关闭">×</button></header>
      <div class="vx-drawer-body">
        <div class="vx-state"><span id="vxState">有证据支持</span><b id="vxConfidence">置信度 86%</b></div>
        <div class="vx-impact"><strong>对方案的作用</strong><span id="vxImpact">用于方案过滤与排序。</span></div>
        <ol class="vx-chain">
          <li><div><small>特征标签</small><strong id="vxTag">省内优先</strong></div></li>
          <li><div><small>结构化处理</small><strong id="vxStructure">地域偏好 = 省内优先</strong><p id="vxType">信息类型：家长观点 · 待学生确认</p></div></li>
          <li><div><small>原始资料</small><strong id="vxSource">首次咨询录音_0818.mp3</strong><blockquote id="vxQuote">“我们希望孩子在省内发展。”</blockquote><div class="vx-source-meta"><span id="vxTime">18:24 · 家长</span><b id="vxOperator">2026-08-20 陈老师导入</b></div></div></li>
        </ol>
        <button class="vx-confirm" id="vxConfirm">标记为咨询师已核验</button>
      </div>
    </aside>
    <div class="vx-modal" id="vxImport" aria-hidden="true">
      <div class="vx-modal-card" role="dialog" aria-modal="true" aria-label="资料导入流程">
        <header class="vx-modal-head"><div><span class="vx-kicker">外部资料导入</span><h2>原文 → 结构化 → 特征标签</h2></div><button class="vx-close" data-vx-close aria-label="关闭">×</button></header>
        <div class="vx-steps"><div class="vx-step active" data-vx-step="1"><b>01</b>原文提取</div><div class="vx-step" data-vx-step="2"><b>02</b>结构化处理</div><div class="vx-step" data-vx-step="3"><b>03</b>标签融合</div></div>
        <div class="vx-import-body">
          <section class="vx-import-panel active" data-vx-panel="1"><div class="vx-drop"><div><div class="vx-drop-mark">↑</div><h3>导入文档或音频</h3><p>演示文件不会上传，仅用于体验处理链路</p><button class="vx-demo-file" id="vxFile"><span class="vx-drop-mark" style="width:35px;height:35px;font-size:9px">MP3</span><span><b>首次咨询录音_0818.mp3</b><span>36:24 · 学生 / 家长 / 陈老师</span></span></button></div></div></section>
          <section class="vx-import-panel" data-vx-panel="2"><div class="vx-transcript"><div class="vx-line"><b>家长</b><time>18:24</time><p>我们还是希望孩子在省内发展，城市不要太远。</p></div><div class="vx-line hot"><b>学生</b><time>18:25</time><p>我比较喜欢计算机相关的专业，动手实践多一点，不太喜欢纯理论研究。</p></div><div class="vx-line"><b>陈老师</b><time>18:26</time><p>如果省外的专业实践机会更好，高铁三小时以内可以接受吗？</p></div></div></section>
          <section class="vx-import-panel" data-vx-panel="3"><div class="vx-tag-results"><label><input checked type="checkbox"><span class="vx-tag-chip">计算机应用兴趣</span><small>兴趣与动机</small></label><label><input checked type="checkbox"><span class="vx-tag-chip">偏好动手实践</span><small>学科能力</small></label><label><input checked type="checkbox"><span class="vx-tag-chip">省内优先</span><small>待学生确认</small></label><label><input checked type="checkbox"><span class="vx-tag-chip">高铁 3 小时</span><small>地域与生活</small></label><label><input checked type="checkbox"><span class="vx-tag-chip">不偏纯理论</span><small>兴趣与动机</small></label><label><input checked type="checkbox"><span class="vx-tag-chip">城市可让步</span><small>AI 推断</small></label></div></section>
        </div>
        <footer class="vx-modal-actions"><button class="vx-btn" id="vxPrev" hidden>上一步</button><button class="vx-btn primary" id="vxNext" disabled>提取原文</button></footer>
      </div>
    </div>
    <div class="vx-toast" id="vxToast">已更新</div>
  `);

  const drawer = q("#vxDrawer");
  const backdrop = q(".vx-backdrop");
  const modal = q("#vxImport");
  let step = 1;
  let timer;

  function lock() { document.body.classList.toggle("vx-locked", drawer.classList.contains("open") || modal.classList.contains("open")); }
  function toast(message) { const el = q("#vxToast"); el.textContent = message; el.classList.add("show"); clearTimeout(timer); timer = setTimeout(() => el.classList.remove("show"), 2200); }
  function closeAll() { drawer.classList.remove("open"); backdrop.classList.remove("open"); modal.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); modal.setAttribute("aria-hidden", "true"); lock(); }
  function openDrawer(el) {
    const d = el.dataset;
    const hasImportedSource = Boolean(d.source || d.quote || d.operator || d.time);
    q("#vxDimension").textContent = d.dimension || "画像证据";
    q("#vxTitle").textContent = d.label || el.textContent.trim();
    q("#vxTag").textContent = d.label || el.textContent.trim();
    q("#vxState").textContent = d.state || "有证据支持";
    q("#vxConfidence").textContent = d.confidence || "置信度 86%";
    q("#vxImpact").textContent = d.impact || "该标签会参与方案过滤、排序或风险解释。";
    q("#vxStructure").textContent = d.structure || `${d.dimension || "画像字段"} = ${d.label || el.textContent.trim()}`;
    q("#vxType").textContent = d.type || (hasImportedSource ? "信息类型：学生自述偏好 · 有原话支持" : "信息类型：系统字段或行为记录 · 自动同步");
    q("#vxSource").textContent = d.source || (hasImportedSource ? "首次咨询录音_0818.mp3" : "当前考生档案 · 系统记录");
    q("#vxQuote").textContent = d.quote || (hasImportedSource ? "“我比较喜欢计算机相关的专业，动手实践多一点。”" : `“${d.label || el.textContent.trim()}”`);
    q("#vxTime").textContent = d.time || (hasImportedSource ? "18:25 · 学生" : "最近一次资料同步");
    q("#vxOperator").textContent = d.operator || (hasImportedSource ? "2026-08-20 陈老师导入" : "系统自动同步");
    drawer.classList.add("open"); backdrop.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); lock();
  }
  function updateImport() {
    qa("[data-vx-panel]").forEach(el => el.classList.toggle("active", Number(el.dataset.vxPanel) === step));
    qa("[data-vx-step]").forEach(el => { const n = Number(el.dataset.vxStep); el.classList.toggle("active", n === step); el.classList.toggle("done", n < step); });
    q("#vxPrev").hidden = step === 1;
    q("#vxNext").textContent = step === 1 ? "提取原文" : step === 2 ? "生成特征标签" : "融合 6 个标签";
    if (step > 1) q("#vxNext").disabled = false;
  }
  document.addEventListener("click", e => {
    const ev = e.target.closest("[data-vx-evidence]"); if (ev) { openDrawer(ev); return; }
    if (e.target.closest("[data-vx-import]")) { modal.classList.add("open"); modal.setAttribute("aria-hidden", "false"); lock(); return; }
    if (e.target.closest("[data-vx-close]")) closeAll();
  });
  q("#vxFile").addEventListener("click", () => { q("#vxNext").disabled = false; toast("演示文件已就绪"); });
  q("#vxNext").addEventListener("click", () => { if (step < 3) { step += 1; updateImport(); } else { closeAll(); toast("6 个标签已融合，冲突项进入待核验队列"); step = 1; q("#vxNext").disabled = true; updateImport(); } });
  q("#vxPrev").addEventListener("click", () => { if (step > 1) step -= 1; updateImport(); });
  q("#vxConfirm").addEventListener("click", () => { q("#vxState").textContent = "咨询师已核验"; q("#vxConfirm").textContent = "已确认并保留证据链"; q("#vxConfirm").disabled = true; toast("标签状态已更新"); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeAll(); });
})();
