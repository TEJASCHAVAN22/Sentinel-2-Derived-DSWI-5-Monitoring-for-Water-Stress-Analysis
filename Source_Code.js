// --------------------- 1. Define AOI & Date Range -------------------------
var START = ee.Date('2016-01-01');   // DW available from 2016
var END   = ee.Date('2016-12-31');

var aoi = ee.FeatureCollection('projects/gee-trial2/assets/Shapfile/WMH_Distric');
Map.centerObject(aoi, 9);
Map.addLayer(aoi, {}, 'AOI');

// --------------------- 2. Load Dynamic World & Sentinel-2 ----------------
var dwCol = ee.ImageCollection('GOOGLE/DYNAMICWORLD/V1')
                .filterBounds(aoi)
                .filterDate(START, END);

var s2Col = ee.ImageCollection("COPERNICUS/S2_HARMONIZED")
                .filterBounds(aoi)
                .filterDate(START, END)
                .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 30));

// --------- Link Dynamic World images with matching Sentinel-2 images -------
var linkedCol = dwCol.linkCollection(
    s2Col,
    s2Col.first().bandNames()
);

// Get first linked image
var linkedImg = ee.Image(linkedCol.first());

// --------------------- 3. Dynamic World Visualization ------------------
var CLASS_NAMES = [
  'water', 'trees', 'grass', 'flooded_vegetation',
  'crops', 'shrub_and_scrub', 'built', 'bare', 'snow_and_ice'
];

var VIS_PALETTE = [
  '419bdf','397d49','88b053','7a87c6','e49635',
  'dfc35a','c4281b','a59b8f','b39fe1'
];

// DW label to RGB
var dwRgb = linkedImg.select('label')
  .visualize({min: 0, max: 8, palette: VIS_PALETTE})
  .divide(255);// ---------------- AOI ----------------
var aoi = ee.FeatureCollection('projects/gee-trial2/assets/WMH_Distric');
Map.centerObject(aoi, 8);

// ---------------- Date Range ----------------
var start = '2024-01-01';
var end   = '2024-12-31';

// ---------------- Sentinel-2 SR ----------------
var s2 = ee.ImageCollection("COPERNICUS/S2_SR")
  .filterBounds(aoi)
  .filterDate(start, end)
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
  .map(function(img){
    // Compute DSWI-5 = (B8 - B3) / (B12 + B4)
    var dswi5 = img.expression(
      '(NIR - Green) / (SWIR + Red)', {
        'NIR':   img.select('B8'),
        'Green': img.select('B3'),
        'Red':   img.select('B4'),
        'SWIR':  img.select('B12')
      }
    ).rename('DSWI5');

    return img.addBands(dswi5);
  });

// ---------------- Median image ----------------
var dswi5_median = s2.select('DSWI5').median();

// ---------------- Add to Map ----------------
Map.addLayer(dswi5_median.clip(aoi),
  {min:-1, max:1, palette:['blue','white','red']},
  'DSWI-5');

// ---------------- Time Series Chart ----------------
var chart = ui.Chart.image.series({
  imageCollection: s2.select('DSWI5'),
  region: aoi,
  reducer: ee.Reducer.mean(),
  scale: 20
})
.setOptions({
  title: 'DSWI-5 Time Series (Sentinel-2)',
  hAxis: {title: 'Date'},
  vAxis: {title: 'DSWI-5'},
  lineWidth: 2
});

print(chart);


// Probability max
var top1Prob = linkedImg.select(CLASS_NAMES).reduce(ee.Reducer.max());

// Hillshade
var top1ProbHillshade = ee.Terrain.hillshade(top1Prob.multiply(100))
                                 .divide(255);

// Final visual
var dwRgbHillshade = dwRgb.multiply(top1ProbHillshade);

// --------------------- 4. Display Layers -------------------------------
Map.addLayer(
  linkedImg,
  {min: 0, max: 3000, bands: ['B4', 'B3', 'B2']},
  'Sentinel-2 RGB'
);

Map.addLayer(
  dwRgbHillshade,
  {min: 0, max: 0.65},
  'Dynamic World – Hillshade'
);
