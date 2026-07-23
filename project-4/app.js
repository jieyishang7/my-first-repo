const restaurants = [
  ['Keens Steakhouse','steakhouse',-73.9865,40.7507,'Midtown','Manhattan'],['Gallaghers','steakhouse',-73.9868,40.7623,'Theater District','Manhattan'],['Smith & Wollensky','steakhouse',-73.9719,40.7552,'Midtown East','Manhattan'],['Old Homestead','steakhouse',-74.0045,40.7413,'Chelsea','Manhattan'],['Strip House','steakhouse',-73.9882,40.7342,'Greenwich Village','Manhattan'],['Bowery Meat Company','steakhouse',-73.9918,40.7243,'NoHo','Manhattan'],['Wolfgang’s','steakhouse',-73.9822,40.7465,'Midtown','Manhattan'],['Benjamin Steakhouse','steakhouse',-73.9779,40.7514,'Midtown East','Manhattan'],['Cote','steakhouse',-73.9879,40.741,'Flatiron','Manhattan'],['Porter House','steakhouse',-73.9824,40.7682,'Columbus Circle','Manhattan'],['Delmonico’s','steakhouse',-74.0103,40.705,'Financial District','Manhattan'],['American Cut','steakhouse',-74.0098,40.7196,'Tribeca','Manhattan'],['Hawksmoor','steakhouse',-73.9881,40.7394,'Gramercy','Manhattan'],['Quality Meats','steakhouse',-73.9766,40.7645,'Midtown','Manhattan'],['The Palm','steakhouse',-73.9722,40.7512,'Midtown East','Manhattan'],['212 Steakhouse','steakhouse',-73.9718,40.7566,'Midtown East','Manhattan'],['STK Downtown','steakhouse',-74.0074,40.7397,'Meatpacking','Manhattan'],['Club A','steakhouse',-73.9694,40.7604,'Midtown East','Manhattan'],['Vinyl Steakhouse','steakhouse',-73.993,40.7381,'Flatiron','Manhattan'],['Butcher and Banker','steakhouse',-73.9862,40.7525,'Midtown','Manhattan'],
  ['Ricardo Steak House','steakhouse',-73.9349,40.7937,'East Harlem','Manhattan'],['Harlem Prime','steakhouse',-73.9443,40.8115,'Harlem','Manhattan'],['4 Charles Prime Rib','steakhouse',-74.0027,40.7351,'West Village','Manhattan'],['Wolfgang’s Tribeca','steakhouse',-74.0096,40.7169,'Tribeca','Manhattan'],['Peter Luger','steakhouse',-73.9626,40.7099,'Williamsburg','Brooklyn'],['St. Anselm','steakhouse',-73.9545,40.7142,'Williamsburg','Brooklyn'],['Gage & Tollner','steakhouse',-73.9877,40.6917,'Downtown Brooklyn','Brooklyn'],['Amber Steak House','steakhouse',-73.9540,40.7306,'Greenpoint','Brooklyn'],['DeStefano’s','steakhouse',-73.9492,40.7159,'Williamsburg','Brooklyn'],['Benchmark','steakhouse',-73.9834,40.6750,'Park Slope','Brooklyn'],['Christos Steak House','steakhouse',-73.9186,40.7708,'Astoria','Queens'],['Meet the Meat','steakhouse',-73.9080,40.7634,'Astoria','Queens'],['Uncle Jack’s','steakhouse',-73.7704,40.7644,'Bayside','Queens'],['M. Wells Steakhouse','steakhouse',-73.9396,40.7537,'Long Island City','Queens'],['Jake’s Steakhouse','steakhouse',-73.9074,40.8861,'Riverdale','Bronx'],['Ruddy & Dean','steakhouse',-74.0757,40.6412,'St. George','Staten Island'],
  ['Via Carota','pasta',-74.0035,40.7336,'West Village','Manhattan'],['L’Artusi','pasta',-74.0058,40.7339,'West Village','Manhattan'],['I Sodi','pasta',-74.0022,40.7332,'West Village','Manhattan'],['Don Angie','pasta',-74.0044,40.7378,'West Village','Manhattan'],['Rezdôra','pasta',-73.9874,40.7388,'Flatiron','Manhattan'],['Misi Pasta','pasta',-74.0068,40.7221,'SoHo','Manhattan'],['Lilia','pasta',-73.9973,40.7189,'Nolita','Manhattan'],['Forsythia','pasta',-73.991,40.7181,'Lower East Side','Manhattan'],['Fiaschetteria Pistoia','pasta',-73.9829,40.7263,'East Village','Manhattan'],['Il Buco','pasta',-73.9927,40.7258,'NoHo','Manhattan'],['Rubirosa','pasta',-73.9962,40.7227,'Nolita','Manhattan'],['Bar Primi','pasta',-73.9917,40.7252,'Bowery','Manhattan'],['Osteria Morini','pasta',-73.9978,40.723,'SoHo','Manhattan'],['Maialino','pasta',-73.9854,40.7363,'Gramercy','Manhattan'],['Piccola Cucina','pasta',-74.0023,40.7251,'SoHo','Manhattan'],['Ci Siamo','pasta',-74.0027,40.7527,'Hudson Yards','Manhattan'],['Scarpetta','pasta',-73.9934,40.7443,'NoMad','Manhattan'],['Locanda Verde','pasta',-74.01,40.7199,'Tribeca','Manhattan'],['Rafele','pasta',-74.0017,40.7355,'West Village','Manhattan'],['San Marzano','pasta',-73.9854,40.7285,'East Village','Manhattan'],
  ['Rao’s','pasta',-73.9345,40.7932,'East Harlem','Manhattan'],['Patsy’s Italian','pasta',-73.9446,40.8019,'East Harlem','Manhattan'],['Vinateria','pasta',-73.9445,40.8137,'Harlem','Manhattan'],['Fumo Harlem','pasta',-73.9508,40.8218,'Harlem','Manhattan'],['Saggio','pasta',-73.9376,40.8515,'Washington Heights','Manhattan'],['Trattoria iL Gusto','pasta',-73.9805,40.7769,'Upper West Side','Manhattan'],['Lilia Williamsburg','pasta',-73.9526,40.7178,'Williamsburg','Brooklyn'],['Misi Williamsburg','pasta',-73.9678,40.7110,'Williamsburg','Brooklyn'],['Frankies 457','pasta',-73.9991,40.6775,'Carroll Gardens','Brooklyn'],['Fausto','pasta',-73.9750,40.6770,'Park Slope','Brooklyn'],['Roberta’s','pasta',-73.9337,40.7050,'Bushwick','Brooklyn'],['Trattoria L’Incontro','pasta',-73.9121,40.7643,'Astoria','Queens'],['Maiella','pasta',-73.9567,40.7474,'Long Island City','Queens'],['Zero Otto Nove','pasta',-73.8860,40.8545,'Belmont','Bronx'],['Roberto’s','pasta',-73.8886,40.8547,'Belmont','Bronx'],['Enoteca Maria','pasta',-74.0775,40.6436,'St. George','Staten Island']
].map(([name,type,lon,lat,area,borough]) => ({name,type,lon,lat,area,borough}));

const svg = d3.select('#mapSvg');
const tooltip = document.querySelector('#tooltip');
const districtInfo = document.querySelector('#districtInfo');
const visibleCount = document.querySelector('#visibleCount');
const baseProjection = d3.geoMercator().scale(1/(2*Math.PI)).translate([0,0]);
const projection = d3.geoMercator();
const path = d3.geoPath(projection);
const tileLayout = d3.tile().tileSize(256);
const tileLayer = svg.append('g').attr('class','tile-layer');
const districtLayer = svg.append('g').attr('class','district-layer');
const glowLayer = svg.append('g').attr('class','glow-layer');
const pointLayer = svg.append('g').attr('class','point-layer');
let width, height, currentFilter = 'all', selectedDistrict = null, initialTransform;

const districts = districtLayer.selectAll('path').data(window.MANHATTAN_DATA.features).join('path').attr('class','district')
  .on('click',(event,feature)=>{event.stopPropagation();selectedDistrict=feature;districts.classed('selected',d=>d===feature);districtInfo.innerHTML=`<span>MANHATTAN DISTRICT</span><strong>${feature.properties.name}</strong>`;zoomToFeature(feature)});

const points = pointLayer.selectAll('circle').data(restaurants).join('circle').attr('class','restaurant-point').attr('r',5)
  .attr('fill',d=>d.type==='steakhouse'?'#eaff00':'#b44cff')
  .on('mouseenter',(event,d)=>showTooltip(event,d)).on('mousemove',(event,d)=>showTooltip(event,d)).on('mouseleave',()=>tooltip.style.display='none');
const glows = glowLayer.selectAll('circle').data(restaurants).join('circle').attr('class','restaurant-glow').attr('r',14)
  .attr('fill',d=>d.type==='steakhouse'?'rgba(234,255,0,.28)':'rgba(180,76,255,.3)');

function showTooltip(event,d){const box=document.querySelector('.map-stage').getBoundingClientRect();tooltip.innerHTML=`<strong>${d.name}</strong><span>${d.type} · ${d.area} · ${d.borough}</span>`;tooltip.style.display='block';tooltip.style.left=Math.min(event.clientX-box.left+14,box.width-220)+'px';tooltip.style.top=Math.max(10,event.clientY-box.top-55)+'px'}

function tileUrl([x,y,z]){const n=2**z;const wrapped=(x%n+n)%n;return `https://a.basemaps.cartocdn.com/dark_all/${z}/${wrapped}/${y}@2x.png`}

function zoomed(event){
  const transform=event.transform;
  const tiles=tileLayout.extent([[0,0],[width,height]])(transform);
  tileLayer.selectAll('image').data(tiles,d=>d.join('/')).join(
    enter=>enter.append('image').attr('class','map-tile').attr('href',tileUrl),
    update=>update,
    exit=>exit.remove()
  ).attr('x',d=>(d[0]+tiles.translate[0])*tiles.scale).attr('y',d=>(d[1]+tiles.translate[1])*tiles.scale).attr('width',tiles.scale+1).attr('height',tiles.scale+1);
  projection.scale(transform.k/(2*Math.PI)).translate([transform.x,transform.y]);
  districts.attr('d',path);
  glows.attr('cx',d=>projection([d.lon,d.lat])[0]).attr('cy',d=>projection([d.lon,d.lat])[1]);
  points.attr('cx',d=>projection([d.lon,d.lat])[0]).attr('cy',d=>projection([d.lon,d.lat])[1]);
  tooltip.style.display='none';
}

const zoom=d3.zoom().scaleExtent([2**15,2**24]).on('zoom',zoomed);
svg.call(zoom).on('click',()=>{selectedDistrict=null;districts.classed('selected',false);districtInfo.innerHTML='<span>SELECT A MANHATTAN DISTRICT</span><strong>Click a cyan boundary to inspect and zoom</strong>'});

function setup(){
  const box=svg.node().getBoundingClientRect();width=box.width;height=box.height;tileLayout.extent([[0,0],[width,height]]);
  const center=baseProjection([-73.975,40.775]);const scale=2**19.15;
  initialTransform=d3.zoomIdentity.translate(width/2,height/2).scale(scale).translate(-center[0],-center[1]);
  svg.call(zoom.transform,initialTransform);
}

function zoomToFeature(feature){
  const fitted=d3.geoMercator().fitExtent([[90,70],[width-90,height-70]],feature);
  const target=d3.zoomIdentity.translate(fitted.translate()[0],fitted.translate()[1]).scale(fitted.scale()*2*Math.PI);
  svg.transition().duration(750).call(zoom.transform,target);
}

function applyFilter(filter){
  currentFilter=filter;const filtered=restaurants.filter(d=>filter==='all'||d.type===filter);
  points.style('display',d=>filter==='all'||d.type===filter?null:'none');glows.style('display',d=>filter==='all'||d.type===filter?null:'none');visibleCount.textContent=filtered.length;
}

document.querySelector('#allCount').textContent=restaurants.length;
document.querySelector('#steakCount').textContent=restaurants.filter(d=>d.type==='steakhouse').length;
document.querySelector('#pastaCount').textContent=restaurants.filter(d=>d.type==='pasta').length;
visibleCount.textContent=restaurants.length;
document.querySelectorAll('.filter-button').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.filter-button').forEach(item=>{const active=item===button;item.classList.toggle('active',active);item.setAttribute('aria-pressed',active)});applyFilter(button.dataset.filter)}));
document.querySelector('#zoomIn').addEventListener('click',()=>svg.transition().duration(300).call(zoom.scaleBy,1.6));
document.querySelector('#zoomOut').addEventListener('click',()=>svg.transition().duration(300).call(zoom.scaleBy,1/1.6));
document.querySelector('#resetView').addEventListener('click',()=>{selectedDistrict=null;districts.classed('selected',false);districtInfo.innerHTML='<span>SELECT A MANHATTAN DISTRICT</span><strong>Click a cyan boundary to inspect and zoom</strong>';svg.transition().duration(700).call(zoom.transform,initialTransform)});
setup();new ResizeObserver(setup).observe(svg.node());
