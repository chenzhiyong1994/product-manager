(() => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const evidenceMap = {
    province: {
      dimension: "学业基线", title: "广东 · 2026届", state: "confirmed", stateText: "已确认", confidence: "咨询师确认",
      impact: "用于匹配广东省招生计划、选科要求与当年位次区间。",
      structure: "生源省份 = 广东；毕业年份 = 2026", type: "信息类型：基础事实 · 长期有效",
      source: "个人资料", quote: "省份：广东；年级：2026届。", time: "系统字段", operator: "2026-06-12 陈老师确认", verification: "咨询师已确认", hint: "该信息可直接用于规则校验与推荐计算。"
    },
    subjects: {
      dimension: "学业基线", title: "物理 / 化学 / 生物", state: "confirmed", stateText: "已确认", confidence: "咨询师确认",
      impact: "用于过滤选科不符的专业，并匹配广东物理类招生计划。",
      structure: "首选科目 = 物理；再选科目 = 化学、生物", type: "信息类型：基础事实 · 高决策影响",
      source: "个人资料", quote: "选科组合：物理 / 化学 / 生物。", time: "系统字段", operator: "2026-06-12 陈老师确认", verification: "咨询师已确认", hint: "该信息可直接用于专业资格校验。"
    },
    score: {
      dimension: "学业基线", title: "570分 · 55,692位", state: "supported", stateText: "有证据支持", confidence: "置信度 98%",
      impact: "用于估算可达院校区间；正式方案仍需近三次位次判断波动。",
      structure: "总分 = 570；省位次 = 55,692；考试类型 = 一模", type: "信息类型：成绩事实 · 当前学期有效",
      source: "广东一模成绩单.pdf", quote: "总分 570；物理类省排名 55,692。", time: "第 1 页 · 成绩汇总", operator: "2026-08-18 陈老师导入", verification: "成绩单已核验", hint: "单次成绩可有限使用；生成正式方案前需补充趋势。"
    },
    scoreBand: {
      dimension: "分数情境", title: "本科主体区间", state: "supported", stateText: "有证据支持", confidence: "模型计算",
      impact: "切换提问重点为专业与城市取舍、行业特色院校及冲稳保边界。",
      structure: "位次情境 = 本科主体区间；年度 = 2026预测", type: "信息类型：规则计算 · 随成绩更新",
      source: "分数情境计算", quote: "基于广东物理类 55,692 位与最近招生区间计算。", time: "规则引擎 V3.4", operator: "2026-08-20 系统更新", verification: "规则支持", hint: "该标签随成绩和年度数据自动更新。"
    },
    handsOn: {
      dimension: "学科能力", title: "偏好动手实践", state: "supported", stateText: "有证据支持", confidence: "置信度 88%",
      impact: "用于匹配强调项目、实验和实践课程的专业培养方式。",
      structure: "学习偏好 = 动手实践；主体 = 学生", type: "信息类型：学生自述偏好 · 有原话支持",
      source: "首次咨询录音_0818.mp3", quote: "“我比较喜欢计算机相关的专业，动手实践多一点的。”", time: "18:25–18:31 · 学生", operator: "2026-08-20 陈老师导入", verification: "有证据支持", hint: "可用于生成专业探索建议；仍建议用项目经历交叉核验。"
    },
    computerInterest: {
      dimension: "兴趣与动机", title: "计算机应用兴趣", state: "supported", stateText: "有证据支持", confidence: "置信度 86%",
      impact: "优先比较计算机类、电子信息类和自动化的应用方向。",
      structure: "兴趣方向 = 计算机应用；偏好 = 实践；回避 = 纯理论", type: "信息类型：学生自述偏好 · 需投入证据补强",
      source: "首次咨询录音_0818.mp3", quote: "“我比较喜欢计算机相关的专业，动手实践多一点的，不太喜欢纯理论研究。”", time: "18:25–18:31 · 学生", operator: "2026-08-20 陈老师导入", verification: "有证据支持", hint: "当前可用于生成探索路径，不等同于“适合计算机专业”的结论。"
    },
    provinceFirst: {
      dimension: "地域与生活", title: "省内优先", state: "conflicted", stateText: "待核验", confidence: "仅家长陈述",
      impact: "确认后将过滤大量省外院校；当前仅用于生成学生确认问题。",
      structure: "地域偏好 = 省内优先；主体 = 家长", type: "信息类型：他人观点 · 学生尚未表态",
      source: "首次咨询录音_0818.mp3", quote: "“我们还是希望孩子在省内发展，城市不要太远，但也要有发展机会。”", time: "18:24–18:31 · 家长", operator: "2026-08-20 陈老师导入", verification: "待学生确认", hint: "当前标签仅用于生成追问，不直接参与志愿排序。"
    },
    budget: {
      dimension: "家庭条件 · 敏感", title: "公办预算可控", state: "supported", stateText: "有证据支持", confidence: "家长单方陈述",
      impact: "影响本科线附近的民办本科、公办专科与中外合作兜底结构。",
      structure: "预算边界 = 公办可接受；民办需讨论；敏感等级 = 敏感", type: "信息类型：家庭条件 · 分级展示",
      source: "家庭沟通纪要_0819.docx", quote: "“公办正常学费没有问题，民办或中外合作需要再商量。”", time: "第 2 页 · 家庭条件", operator: "2026-08-20 陈老师导入", verification: "待家庭共同确认", hint: "仅在涉及费用差异的方案中使用，导出时默认隐藏具体金额。"
    },
    execution: {
      dimension: "行动能力", title: "可完成短期项目", state: "supported", stateText: "有证据支持", confidence: "置信度 79%",
      impact: "可安排 1–2 周专业体验任务，用完成情况进一步验证方向。",
      structure: "执行周期 = 短期；证据 = 完成简单编程项目", type: "信息类型：行为证据 · 当前学期有效",
      source: "首次咨询纪要.docx", quote: "学生曾跟随线上课程完成一个简单网页项目，持续约两周。", time: "第 3 页 · 兴趣经历", operator: "2026-08-20 陈老师导入", verification: "有证据支持", hint: "建议通过下一项体验任务核验自驱与复盘能力。"
    }
  };

  const gapMap = {
    rank: { dimension: "必填信息", title: "近三次位次待补", impact: "位次趋势会直接改变冲、稳、保的院校区间。", question: "请补充最近三次同口径考试的总分、位次与考试类型。", action: "打开成绩补录" },
    major: { dimension: "必填信息", title: "不可接受专业待补", impact: "这是专业过滤的硬边界，缺失时可能生成学生无法接受的候选。", question: "哪些专业是明确不能接受的？是名称排斥，还是课程与工作内容不接受？", action: "发起快速确认" },
    adjust: { dimension: "必填信息", title: "调剂意愿待补", impact: "决定保院校与保专业的优先级，并影响滑档风险。", question: "同一院校内，如果可能调剂到不喜欢的专业，能接受到什么程度？", action: "记录调剂边界" },
    batch: { dimension: "分数情境", title: "批次边界距离待计算", impact: "用于判断当前区间对单次成绩波动的敏感度。", question: "需要补充同口径考试与当次分段表。", action: "补充分段表" },
    learning: { dimension: "学科能力", title: "学习速度待补", impact: "影响高难度理论专业和跨学科路线的适配判断。", question: "面对新知识时，更常见的是理解慢但扎实，还是上手快但容易遗忘？", action: "加入下次提问" },
    longInterest: { dimension: "兴趣与动机", title: "长期投入证据不足", impact: "帮助区分“喜欢听说”与愿意长期投入。", question: "过去半年主动投入最多时间做了什么？持续了多久？", action: "加入体验任务" },
    careerValue: { dimension: "职业价值", title: "收入 / 城市取舍待确认", impact: "用于专业、城市与职业路径的联合排序。", question: "收入、稳定、城市三者只能保两个，你会怎么选？", action: "发起价值排序" },
    decisionRole: { dimension: "家庭条件", title: "家庭决策权待确认", impact: "识别哪些是建议，哪些是不可突破的家庭底线。", question: "最终院校与专业由谁拍板？发生分歧时怎么处理？", action: "安排共同确认" },
    repeat: { dimension: "风险偏好", title: "复读接受度待补", impact: "用于位次下滑时建立本科、专科与复读的兜底排序。", question: "如果结果未达预期，复读是否是可接受选项？可接受的条件是什么？", action: "加入风险确认" },
    review: { dimension: "行动能力", title: "复盘习惯待补", impact: "决定后续任务拆分粒度与提醒机制。", question: "完成一项学习任务后，通常会怎么记录问题和调整方法？", action: "加入下次提问" },
    materials: { dimension: "特殊路径", title: "材料准备度待补", impact: "影响综评等特殊路径是否仍可执行。", question: "奖项、活动、研究性学习与证明材料目前准备到什么程度？", action: "创建材料清单" }
  };

  const normalizeKey = (value) => value.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  const drawer = $("#evidenceDrawer");
  const toast = $("#toast");
  let toastTimer;
  let importStep = 1;

  const showToast = (message) => {
    $("span", toast).textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
  };

  const syncScrollLock = () => {
    const hasOverlay = drawer.classList.contains("open") || $$(".modal.open").length > 0;
    document.body.classList.toggle("no-scroll", hasOverlay);
  };

  const setEvidenceStatus = (state, text, confidence) => {
    const status = $("#evidenceStatus");
    status.className = `evidence-status ${state === "supported" || state === "confirmed" ? "" : state}`.trim();
    $("span", status).textContent = text;
    $("b", status).textContent = confidence;
  };

  const openEvidence = (data) => {
    $("#evidenceDimension").textContent = data.dimension;
    $("#evidenceTitle").textContent = data.title;
    setEvidenceStatus(data.state, data.stateText, data.confidence);
    $("#evidenceImpact").textContent = data.impact;
    $("#traceTag").textContent = data.title;
    $("#traceStructure").textContent = data.structure;
    $("#traceType").textContent = data.type;
    $("#traceSourceName").textContent = data.source;
    $("#traceQuote").textContent = data.quote;
    $("#traceTime").textContent = data.time;
    $("#traceOperator").textContent = data.operator;
    $("#verificationLabel").textContent = data.verification;
    $("#verificationHint").textContent = data.hint;
    $("#confirmEvidence").textContent = data.state === "confirmed" ? "已由咨询师核验" : "标记为咨询师已核验";
    $("#confirmEvidence").disabled = data.state === "confirmed";
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    syncScrollLock();
  };

  const openGap = (gapKey) => {
    const gap = gapMap[normalizeKey(gapKey)] || gapMap[gapKey];
    if (!gap) return;
    openEvidence({
      dimension: gap.dimension,
      title: gap.title,
      state: "conflicted",
      stateText: "信息缺口",
      confidence: "尚不可用于决策",
      impact: gap.impact,
      structure: "画像字段 = 未填写",
      type: `建议追问：${gap.question}`,
      source: "暂无原始证据",
      quote: "补齐后，系统会保留原始回答、操作人、时间与确认状态。",
      time: "待采集",
      operator: "优先级由决策影响计算",
      verification: "待补充",
      hint: gap.impact,
      action: gap.action
    });
    $("#confirmEvidence").textContent = gap.action;
    $("#confirmEvidence").disabled = false;
  };

  const closeDrawer = () => {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    syncScrollLock();
  };

  $$('[data-evidence]').forEach((button) => {
    button.addEventListener("click", () => {
      const rawId = button.dataset.evidence;
      const id = normalizeKey(rawId);
      const fallback = {
        dimension: button.closest(".dimension-card")?.querySelector(".card-title span")?.textContent.trim() || "画像标签",
        title: button.childNodes[0].textContent.trim(), state: button.classList.contains("candidate") ? "candidate" : button.classList.contains("conflicted") ? "conflicted" : button.classList.contains("confirmed") ? "confirmed" : "supported",
        stateText: button.classList.contains("confirmed") ? "已确认" : button.classList.contains("candidate") ? "AI 推断" : button.classList.contains("conflicted") ? "待核验" : "有证据支持",
        confidence: button.classList.contains("candidate") ? "需人工核验" : "置信度 82%",
        impact: "该标签会参与画像解释，并根据确认状态决定是否进入方案计算。",
        structure: `画像字段 = ${button.childNodes[0].textContent.trim()}`, type: "信息类型：系统资料或咨询记录",
        source: "系统画像数据", quote: `“${button.childNodes[0].textContent.trim()}”`, time: "来源记录可追溯", operator: "最近由陈老师更新",
        verification: button.classList.contains("confirmed") ? "咨询师已确认" : "待咨询师确认", hint: "确认后可提升证据确认度。"
      };
      openEvidence(evidenceMap[id] || fallback);
    });
  });

  $$('[data-gap]').forEach((button) => button.addEventListener("click", () => {
    closeModal(button.closest(".modal"));
    openGap(button.dataset.gap);
  }));
  $$('[data-close-drawer]').forEach((button) => button.addEventListener("click", closeDrawer));

  $("#confirmEvidence").addEventListener("click", () => {
    const label = $("#verificationLabel");
    if (label.textContent.includes("待补充")) {
      showToast("已创建补充任务，并加入咨询待办");
      return;
    }
    label.textContent = "咨询师已核验";
    $("#verificationHint").textContent = "该标签将在下次方案计算中按已确认信息使用。";
    setEvidenceStatus("confirmed", "已确认", "陈老师 · 刚刚");
    $("#confirmEvidence").textContent = "已由咨询师核验";
    $("#confirmEvidence").disabled = true;
    showToast("标签已确认，证据链已保留");
  });

  $$(".dimension-card").forEach((card) => card.classList.toggle("has-gap", !!$(".tag.gap", card)));

  $$('[data-view]').forEach((button) => button.addEventListener("click", () => {
    $$('[data-view]').forEach((item) => item.classList.toggle("active", item === button));
    document.body.dataset.view = button.dataset.view;
  }));

  $$('[data-target]').forEach((button) => button.addEventListener("click", () => {
    $$('[data-target]').forEach((item) => item.classList.toggle("active", item === button));
    const target = document.getElementById(button.dataset.target);
    const top = window.scrollY + target.getBoundingClientRect().top - 82;
    window.scrollTo({ top, behavior: "smooth" });
  }));

  const runSearch = (value) => {
    const query = value.trim().toLowerCase();
    let visibleCards = 0;
    $$('[data-search]').forEach((card) => {
      const match = !query || card.dataset.search.toLowerCase().includes(query) || card.textContent.toLowerCase().includes(query);
      card.hidden = !match;
      if (match) visibleCards += 1;
    });
    $$('[data-group]').forEach((group) => {
      group.hidden = $$('[data-search]:not([hidden])', group).length === 0;
    });
    $("#emptySearch").hidden = visibleCards > 0;
  };
  $("#tagSearch").addEventListener("input", (event) => runSearch(event.target.value));
  $("[data-clear-search]").addEventListener("click", () => {
    $("#tagSearch").value = "";
    runSearch("");
    $("#tagSearch").focus();
  });

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    syncScrollLock();
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    syncScrollLock();
  }

  $$('[data-open-import]').forEach((button) => button.addEventListener("click", () => openModal($("#importModal"))));
  $$('[data-open-plan]').forEach((button) => button.addEventListener("click", () => openModal($("#planModal"))));
  $$('[data-close-modal]').forEach((button) => button.addEventListener("click", () => closeModal(button.closest(".modal"))));
  $$(".modal").forEach((modal) => modal.addEventListener("mousedown", (event) => {
    if (event.target === modal) closeModal(modal);
  }));

  const updateImport = () => {
    $$('[data-import-panel]').forEach((panel) => panel.classList.toggle("active", Number(panel.dataset.importPanel) === importStep));
    $$('[data-step-indicator]').forEach((item) => {
      const itemStep = Number(item.dataset.stepIndicator);
      item.classList.toggle("active", itemStep === importStep);
      item.classList.toggle("done", itemStep < importStep);
    });
    $("#importPrev").hidden = importStep === 1;
    const labels = ["", "开始提取原文", "进入结构化处理", "生成特征标签", "融合 6 个标签"];
    $("#importNext").childNodes[0].textContent = `${labels[importStep]} `;
    if (importStep > 1) $("#importNext").disabled = false;
  };

  $("#chooseDemoFile").addEventListener("click", () => {
    $("#demoFile").hidden = false;
    $("#importNext").disabled = false;
    showToast("演示文件已就绪");
  });

  $("#importNext").addEventListener("click", () => {
    const nextButton = $("#importNext");
    if (importStep === 4) {
      closeModal($("#importModal"));
      showToast("6 个标签已融合，画像完整度预计提升至 74%");
      setTimeout(() => {
        importStep = 1;
        $("#demoFile").hidden = true;
        nextButton.disabled = true;
        updateImport();
      }, 300);
      return;
    }
    if (importStep === 1) {
      nextButton.disabled = true;
      nextButton.childNodes[0].textContent = "正在提取原文… ";
      setTimeout(() => {
        importStep += 1;
        updateImport();
      }, 650);
      return;
    }
    importStep += 1;
    updateImport();
  });

  $("#importPrev").addEventListener("click", () => {
    if (importStep > 1) importStep -= 1;
    updateImport();
  });

  $("#generateExplore").addEventListener("click", () => {
    closeModal($("#planModal"));
    showToast("探索版方案任务已创建，将标记 3 项关键信息缺口");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (drawer.classList.contains("open")) closeDrawer();
    else $$(".modal.open").forEach(closeModal);
  });

  updateImport();
})();
