(() => {
  const header = document.querySelector("[data-header]");
  const menuButton = document.querySelector("[data-menu-button]");
  const menu = document.querySelector("[data-menu]");
  const examples = {
    create: {
      prompt: "我们要给连锁门店做一个设备报修模块，店员提交、店长确认、维修商处理。请写一份模块迭代 PRD。",
      route: "create-prd · 模块级迭代",
      result: "输出聚焦流程、状态、角色权限、字段规则、异常与验收；未知业务事实保留为待决。"
    },
    review: {
      prompt: "请严格审查现有报修模块 PRD，重点检查工单状态、角色操作、超时异常和验收口径。",
      route: "check-prd · 聚焦审查",
      result: "逐条定位有证据的问题，按 P0–P3 排序并给出可执行改法，不为数量制造缺陷。"
    }
  };

  const updateHeader = () => header?.classList.toggle("scrolled", window.scrollY > 24);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  menuButton?.addEventListener("click", () => {
    const open = !menu.classList.contains("open");
    menu.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "关闭导航" : "打开导航");
  });

  menu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    menu.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuButton?.setAttribute("aria-expanded", "false");
  }));

  const prompt = document.querySelector("[data-prompt]");
  const route = document.querySelector("[data-route]");
  const result = document.querySelector("[data-result]");
  const resultPanel = document.querySelector(".console-result");
  document.querySelectorAll("[data-example]").forEach((button) => {
    button.addEventListener("click", () => {
      const next = examples[button.dataset.example];
      if (!next || button.classList.contains("active")) return;
      document.querySelectorAll("[data-example]").forEach((item) => {
        const selected = item === button;
        item.classList.toggle("active", selected);
        item.setAttribute("aria-selected", String(selected));
      });
      prompt.classList.add("changing");
      resultPanel.classList.add("changing");
      window.setTimeout(() => {
        prompt.textContent = next.prompt;
        route.textContent = next.route;
        result.textContent = next.result;
        prompt.classList.remove("changing");
        resultPanel.classList.remove("changing");
      }, 180);
    });
  });

  document.querySelector("[data-copy]")?.addEventListener("click", async (event) => {
    const button = event.currentTarget;
    const code = document.querySelector("[data-code]")?.textContent || "";
    try {
      await navigator.clipboard.writeText(code);
      button.textContent = "已复制";
    } catch {
      button.textContent = "请手动复制";
    }
    window.setTimeout(() => { button.textContent = "复制"; }, 1600);
  });

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion || !("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal").forEach((item) => item.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));
  }

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
