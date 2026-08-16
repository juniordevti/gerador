(function () {
  const $ = (id) => document.getElementById(id);

  function setupChips(containerId, single) {
    const container = $(containerId);
    const chips = container.querySelectorAll(".chip");
    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        if (single) {
          chips.forEach((c) => c.classList.remove("active"));
          chip.classList.add("active");
        } else {
          chip.classList.toggle("active");
        }
        render();
      });
    });
  }

  setupChips("styleChips", true);
  setupChips("sectionChips", false);
  setupChips("featureChips", false);

  function getActive(containerId) {
    return Array.from($(containerId).querySelectorAll(".chip.active")).map(
      (c) => c.textContent.trim(),
    );
  }

  function esc(s) {
    return (s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function render() {
    const clientName =
      $("clientName").value.trim() || "[nome do cliente/negócio]";
    const segment = $("segment").value.trim() || "[segmento do negócio]";
    const siteType = $("siteType").value;
    const style = getActive("styleChips")[0] || "[estilo não definido]";
    const palette = $("palette").value.trim();
    const sections = getActive("sectionChips");
    const features = getActive("featureChips");
    const stack = $("stack").value;
    const audience = $("audience").value.trim();
    const tone = $("tone").value;
    const refs = $("refs").value.trim();
    const notes = $("notes").value.trim();

    let lines = [];
    lines.push(`<span class="k">## OBJETIVO</span>`);
    lines.push(
      `Criar um <span class="v">${esc(siteType.toLowerCase())}</span> profissional para <span class="v">${esc(clientName)}</span>, um negócio de <span class="v">${esc(segment)}</span>.`,
    );
    lines.push("");
    lines.push(`<span class="k">## IDENTIDADE VISUAL</span>`);
    lines.push(`Estilo: <span class="v">${esc(style)}</span>`);
    if (palette) {
      lines.push(`Paleta de cores: <span class="v">${esc(palette)}</span>`);
    } else {
      lines.push(
        `<span class="muted-line">Paleta de cores: defina uma paleta coerente com o estilo e o segmento acima (4-6 cores nomeadas em hex).</span>`,
      );
    }
    lines.push(
      `Tipografia: escolha uma combinação de fontes que reforce a personalidade da marca (não usar as fontes-padrão genéricas).`,
    );
    lines.push("");

    lines.push(`<span class="k">## ESTRUTURA / SEÇÕES</span>`);
    if (sections.length) {
      sections.forEach((s) => lines.push(`- ${esc(s)}`));
    } else {
      lines.push(
        `<span class="muted-line">- defina as seções ideais para esse tipo de site</span>`,
      );
    }
    lines.push("");

    lines.push(`<span class="k">## FUNCIONALIDADES</span>`);
    if (features.length) {
      features.forEach((f) => lines.push(`- ${esc(f)}`));
    } else {
      lines.push(
        `<span class="muted-line">- nenhuma funcionalidade extra especificada</span>`,
      );
    }
    lines.push("");

    lines.push(`<span class="k">## STACK TÉCNICA</span>`);
    lines.push(`Desenvolver em <span class="v">${esc(stack)}</span>.`);
    lines.push(
      `O site deve ser responsivo (mobile-first), com boas práticas de acessibilidade (contraste, foco visível, aria-labels) e performance otimizada.`,
    );
    lines.push("");

    lines.push(`<span class="k">## PÚBLICO-ALVO</span>`);
    lines.push(
      audience
        ? `<span class="v">${esc(audience)}</span>`
        : `<span class="muted-line">defina o público-alvo com base no segmento e posicionamento do negócio</span>`,
    );
    lines.push("");

    lines.push(`<span class="k">## TOM DE VOZ / COPY</span>`);
    lines.push(
      `Escreva os textos do site em tom <span class="v">${esc(tone.toLowerCase())}</span>, evitando clichês genéricos de "lorem ipsum corporativo". Use linguagem clara, direta e específica ao negócio.`,
    );
    lines.push("");

    if (refs) {
      lines.push(`<span class="k">## REFERÊNCIAS / INSPIRAÇÃO</span>`);
      lines.push(esc(refs));
      lines.push("");
    }

    if (notes) {
      lines.push(`<span class="k">## OBSERVAÇÕES EXTRAS</span>`);
      lines.push(esc(notes));
      lines.push("");
    }

    lines.push(`<span class="k">## ENTREGA</span>`);
    lines.push(
      `Gere o código completo e funcional, organizado em arquivos separados quando fizer sentido, pronto para eu revisar e ajustar. Explique brevemente as principais decisões de design tomadas.`,
    );

    $("output").innerHTML = lines.join("\n") + '<span class="cursor"></span>';
  }

  function plainTextPrompt() {
    return $("output").innerText.replace("█", "").trim();
  }

  $("copyBtn").addEventListener("click", () => {
    const text = plainTextPrompt();
    navigator.clipboard.writeText(text).then(() => {
      const msg = $("copiedMsg");
      msg.classList.add("show");
      setTimeout(() => msg.classList.remove("show"), 1800);
    });
  });

  $("downloadBtn").addEventListener("click", () => {
    const text = plainTextPrompt();
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "prompt-site.txt";
    a.click();
    URL.revokeObjectURL(url);
  });

  // live update on any input change
  document.querySelectorAll("input, select, textarea").forEach((el) => {
    el.addEventListener("input", render);
    el.addEventListener("change", render);
  });

  render();
})();
