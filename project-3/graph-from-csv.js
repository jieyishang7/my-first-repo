const container = d3.select("#network");

try {
    const nodeRows = d3.csvParse(window.relationalStructureData.nodesCsv);
    const linkRows = d3.csvParse(window.relationalStructureData.edgesCsv);
    const nodes = nodeRows.map(d => ({
      id: d.id.trim(),
      group: Number(d.group),
      value: Number(d.value),
      year: d.year ? Number(d.year) : null,
      rotation: Math.random() * 40 - 20
    }));

    const links = linkRows.map(d => ({
      source: d.source.trim(),
      target: d.target.trim(),
      value: Number(d.value),
      type: d.type.trim()
    }));

    drawNetwork(nodes, links);
  } catch (error) {
    console.error("Unable to load network data:", error);
    container.append("p")
      .attr("class", "load-error")
      .text("Network data could not be loaded.");
  }

function drawNetwork(nodes, links) {
  const element = container.node();
  let width = element.clientWidth;
  let height = element.clientHeight;

  const colors = {
    0: "#f4fdff",
    1: "#00f5ff",
    2: "#ff2bd6",
    3: "#d8ff3e",
    4: "#f6ff8a",
    5: "#9d5cff"
  };
  const groupNames = {
    0: "cultural system",
    1: "institution",
    2: "curatorial movement",
    3: "geographic context",
    4: "architect",
    5: "artist"
  };
  const baseOpacity = d => d.group <= 2 ? 1 : d.group === 5 ? 0.86 : 0.48;
  const labelOpacity = () => 0;
  const groupRadius = d => d.group === 0 ? 1.28 : d.group === 1 ? 1.05 : d.group === 2 ? 0.9 : d.group === 3 ? 0.78 : d.group === 4 ? 0.64 : 0.72;
  const radius = d3.scaleSqrt()
    .domain(d3.extent(nodes, d => d.value))
    .range([10, 19]);
  const linkOpacity = d3.scaleLinear()
    .domain(d3.extent(links, d => d.value))
    .range([0.24, 0.58]);
  const typeOpacity = {
    collection: 1,
    spatial: 0.92,
    academic: 0.58,
    institutional: 0.68,
    intervention: 0.56,
    evolution: 0.72,
    artist: 0.64,
    exhibition: 0.52,
    lineage: 0.62,
    hierarchy: 1
  };

  const svg = container.append("svg")
    .attr("role", "img")
    .attr("aria-labelledby", "network-title network-description")
    .attr("viewBox", [0, 0, width, height]);

  svg.append("title")
    .attr("id", "network-title")
    .text("New York cultural topography network");

  svg.append("desc")
    .attr("id", "network-description")
    .text("A multidimensional force-directed network linking New York art institutions, curatorial movements, geography, architects, artists, and dates.");

  const plot = svg.append("g");

  const link = plot.append("g")
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("class", d => `network-link ${d.type}`)
    .attr("stroke-opacity", d => linkOpacity(d.value) * typeOpacity[d.type]);

  const star = d3.symbol()
    .type(d3.symbolStar)
    .size(d => Math.pow(radius(d.value) * groupRadius(d), 2) * 3.4);

  // The outer group owns the simulation position. The inner path rotates around
  // the symbol origin, so rotation never changes the node's x/y coordinates.
  const nodeAnchor = plot.append("g")
    .selectAll("g")
    .data(nodes)
    .join("g")
    .attr("class", "node-anchor")
    .attr("tabindex", 0)
    .attr("role", "button")
    .attr("aria-pressed", "false")
    .attr("aria-label", d => `${d.id}, ${groupNames[d.group]}, ${d.year ? `year ${d.year}, ` : ""}weight ${d.value}`);

  const floatLayer = nodeAnchor.append("g")
    .attr("class", "node-float")
    .style("--float-duration", (d, i) => `${4.8 + (i % 7) * 0.37}s`)
    .style("animation-delay", (d, i) => `${-(i % 11) * 0.53}s`);

  const node = floatLayer.append("path")
    .attr("class", "network-node")
    .attr("d", star)
    .attr("transform", d => `rotate(${d.rotation})`)
    .attr("fill", d => colors[d.group])
    .attr("stroke", d => colors[d.group])
    .style("color", d => colors[d.group])
    .style("animation-delay", (d, i) => `${-(i % 9) * 0.42}s`)
    .attr("opacity", baseOpacity);

  const label = plot.append("g")
    .selectAll("text")
    .data(nodes)
    .join("text")
    .attr("class", d => `node-label group-${d.group}-label`)
    .attr("dx", d => radius(d.value) * groupRadius(d) + 7)
    .attr("dy", "0.34em")
    .attr("opacity", labelOpacity)
    .text(d => d.group <= 1 ? d.id : d.year ? `${d.id} · ${d.year}` : d.id);

  const radialDistance = (d, canvasWidth, canvasHeight) => {
    const orbit = Math.min(canvasWidth, canvasHeight);
    if (d.group === 0) return 0;
    if (d.group === 1) return orbit * 0.14;
    if (d.group === 2) return orbit * 0.23;
    if (d.group === 5) return orbit * 0.31;
    return orbit * 0.38;
  };

  const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links)
      .id(d => d.id)
      .distance(d => {
        const base = d.type === "hierarchy" ? 94 : d.type === "institutional" || d.type === "evolution" ? 84 : 76;
        return base - d.value * 2;
      })
      .strength(d => {
        const structuralWeight = d.type === "hierarchy" ? 0.18 : d.type === "spatial" || d.type === "collection" ? 0.08 : 0;
        return 0.12 + structuralWeight + d.value * 0.025;
      }))
    .force("charge", d3.forceManyBody()
      .strength(d => d.group === 0 ? -310 : d.group === 1 ? -235 : d.group === 2 ? -165 : d.group === 5 ? -145 : -105))
    .force("collide", d3.forceCollide()
      .radius(d => radius(d.value) * groupRadius(d) + 12)
      .iterations(2))
    .force("radial", d3.forceRadial(
      d => radialDistance(d, width, height),
      width / 2,
      height / 2
    ).strength(d => d.group === 0 ? 0.72 : 0.11))
    .force("x", d3.forceX(width / 2).strength(0.012))
    .force("y", d3.forceY(height / 2).strength(0.012))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .alphaDecay(0.025)
    .velocityDecay(0.42)
    .on("tick", ticked);

  const linked = new Map();
  links.forEach(d => {
    linked.set(`${d.source.id}|${d.target.id}`, true);
    linked.set(`${d.target.id}|${d.source.id}`, true);
  });

  const isNeighbor = (a, b) => a.id === b.id || linked.has(`${a.id}|${b.id}`);
  let selectedNode = null;

  function applySelectedLabels() {
    label.attr("opacity", d => selectedNode && isNeighbor(selectedNode, d) ? 1 : 0);
  }

  function toggleSelection(event, datum) {
    event.stopPropagation();
    selectedNode = selectedNode?.id === datum.id ? null : datum;
    nodeAnchor.attr("aria-pressed", d => selectedNode?.id === d.id ? "true" : "false");
    applySelectedLabels();
  }

  function focus(event, datum) {
    node.attr("opacity", d => isNeighbor(datum, d) ? Math.max(baseOpacity(d), 0.9) : 0.035)
      .classed("is-active", d => isNeighbor(datum, d))
      .attr("stroke-width", d => d.id === datum.id ? 1.8 : 0.9);
    node.filter(d => d.id === datum.id)
      .interrupt()
      .transition()
      .duration(280)
      .ease(d3.easeCubicOut)
      .attr("transform", d => `rotate(${d.rotation + 6})`);
    applySelectedLabels();
    link.attr("stroke-opacity", d =>
      d.source.id === datum.id || d.target.id === datum.id ? 0.96 : 0.025
    ).style("stroke-width", d =>
      d.source.id === datum.id || d.target.id === datum.id ? "1.15px" : "0.5px"
    );
  }

  function unfocus() {
    node.attr("opacity", baseOpacity)
      .classed("is-active", false)
      .attr("stroke-width", 0.8);
    node.interrupt()
      .transition()
      .duration(320)
      .ease(d3.easeCubicOut)
      .attr("transform", d => `rotate(${d.rotation})`);
    applySelectedLabels();
    link.attr("stroke-opacity", d => linkOpacity(d.value) * typeOpacity[d.type])
      .style("stroke-width", d => d.type === "hierarchy" ? "0.75px" : "0.5px");
  }

  nodeAnchor.on("pointerenter focus", focus)
    .on("pointerleave blur", unfocus)
    .on("click", toggleSelection)
    .on("keydown", (event, d) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleSelection(event, d);
      }
    })
    .call(d3.drag()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.18).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }));

  svg.on("click", () => {
    selectedNode = null;
    nodeAnchor.attr("aria-pressed", "false");
    applySelectedLabels();
  });

  function ticked() {
    const margin = 34;
    nodes.forEach(d => {
      d.x = Math.max(margin, Math.min(width - margin, d.x));
      d.y = Math.max(margin, Math.min(height - margin, d.y));
    });

    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);
    nodeAnchor.attr("transform", d => `translate(${d.x},${d.y})`);
    label.attr("x", d => d.x).attr("y", d => d.y);
  }

  const resizeObserver = new ResizeObserver(() => {
    width = element.clientWidth;
    height = element.clientHeight;
    svg.attr("viewBox", [0, 0, width, height]);
    simulation
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("radial", d3.forceRadial(
        d => radialDistance(d, width, height),
        width / 2,
        height / 2
      ).strength(d => d.group === 0 ? 0.72 : 0.11))
      .force("x", d3.forceX(width / 2).strength(0.012))
      .force("y", d3.forceY(height / 2).strength(0.012))
      .alpha(0.35)
      .restart();
  });

  resizeObserver.observe(element);
}
