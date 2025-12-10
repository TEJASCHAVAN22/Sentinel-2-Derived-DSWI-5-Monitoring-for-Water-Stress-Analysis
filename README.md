# 🌍 Google Earth Engine — Dynamic World & Sentinel-2 Analysis

![GEE](https://img.shields.io/badge/Platform-Google%20Earth%20Engine-blue)
![Dataset](https://img.shields.io/badge/Dataset-DynamicWorld%20%7C%20Sentinel--2-green)
![Status](https://img.shields.io/badge/Status-Example%20Script-yellow)

Welcome! This repository contains a Google Earth Engine (GEE) script that links the Dynamic World land-cover predictions with Sentinel-2 imagery, computes a custom DSWI-5 wetness index, and visualizes results (map layers + time series). The README below is designed to be clear, attractive, and ready-to-share.

✨ Quick links
- AOI asset used in the example: projects/gee-trial2/assets/WMH_Distric
- Script contents: linking Dynamic World to Sentinel-2, DSWI-5 computation, visualization & chart.

Table of contents
- 🔰 Introduction
- 🎯 Aim
- 🎯 Objectives
- 🧭 Method
- 🔬 Analysis
- ✅ Outcome
- 🛠️ How to use
- ⚙️ Parameters to tweak
- ⚠️ Limitations & caveats
- 📚 References
- 🧾 License & Contact

---

🔰 Introduction
-------------
This project demonstrates how to combine Google’s Dynamic World land-cover predictions with Sentinel-2 imagery in Earth Engine to:
- Visualize per-scene land-cover labels, enhanced with class-probability hillshade.
- Compute a DSWI-5 index from Sentinel-2 surface reflectance to detect wetness/flooding signals.
- Produce a time series of DSWI-5 for the AOI.

🎯 Aim
------
To provide a compact, reproducible GEE workflow for land-cover visualization and wetness monitoring using Dynamic World + Sentinel-2.

🎯 Objectives
-------------
- Load and filter Dynamic World and Sentinel-2 imagery for a chosen AOI and date range.
- Link Dynamic World frames to matching Sentinel-2 scenes.
- Visualize Dynamic World labels with an ergonomic palette + hillshade for confidence.
- Compute DSWI-5 and display median and time series chart for analysis.

🧭 Method
---------
1. Define AOI & date range
   - Example AOI: projects/gee-trial2/assets/WMH_Distric
2. Load Dynamic World (GOOGLE/DYNAMICWORLD/V1) and Sentinel-2 collections:
   - COPERNICUS/S2_HARMONIZED (for linking/visualization)
   - COPERNICUS/S2_SR (for DSWI-5 computation)
3. Link Dynamic World images to Sentinel-2 images using .linkCollection().
4. Convert Dynamic World label (0..8) into RGB with a palette and compute hillshade from class probability to accentuate confident areas.
5. Compute DSWI-5 band per Sentinel-2 SR image:
   - DSWI-5 = (NIR - Green) / (SWIR + Red)
   - (NIR = B8, Green = B3, Red = B4, SWIR = B12)
6. Produce median DSWI-5 map & a mean-over-AOI time series chart.

🔬 Analysis
-----------
- Dynamic World labels are grouped into nine intuitive classes: water, trees, grass, flooded_vegetation, crops, shrub_and_scrub, built, bare, snow_and_ice.
- Hillshade of the class-probability map highlights areas where model confidence is high — useful when visually interpreting results.
- DSWI-5 helps detect wet surfaces and flooded vegetation when tracked through time.
- Use the time series to identify seasonal trends or abrupt events (e.g., flood onset).

✅ Outcome
----------
- Map layers added to the GEE map:
  - Sentinel-2 RGB (true color)
  - Dynamic World label RGB (with hillshade)
  - Median DSWI-5 layer (palette from dry → wet)
- A printed time series (mean DSWI-5 over AOI) in the Console.
- Readable, reusable GEE script for adaptation to other AOIs and dates.

🛠️ How to use
--------------
1. Create a GEE account (https://earthengine.google.com/).
2. Open the GEE Code Editor: https://code.earthengine.google.com/
3. Copy the script into the Editor and update:
   - AOI asset path (or use a geometry)
   - Date ranges
   - Cloud threshold
4. Run the script — layers and chart appear in Map & Console.

Example snippet (index computation)
```javascript
// Compute DSWI-5 and add to each Sentinel-2 SR image
var dswi5 = img.expression(
  '(NIR - Green) / (SWIR + Red)', {
    'NIR':   img.select('B8'),
    'Green': img.select('B3'),
    'Red':   img.select('B4'),
    'SWIR':  img.select('B12')
  }
).rename('DSWI5');
```

⚙️ Parameters to tweak
----------------------
- START / END : date range for Dynamic World linking
- start / end : date range for Sentinel-2 SR DSWI analysis
- CLOUDY_PIXEL_PERCENTAGE : e.g., 10–30 (lower = less cloud but fewer images)
- AOI : replace with your own FeatureCollection or geometry

⚠️ Limitations & caveats
------------------------
- Dynamic World available from 2016 onward.
- Sentinel-2 SR and HARMONIZED have slightly different band sets/behavior — confirm band names before running.
- Simple metadata cloud filtering is used — consider adding a cloud/shadow mask (e.g., SCL or QA60) for robust analyses.
- DSWI-5 used here is a custom expression; for scientific applications, validate against domain references.

📚 References
-------------
- Dynamic World dataset: https://developers.google.com/earth-engine/datasets/catalog/GOOGLE_DYNAMICWORLD_V1
- Sentinel-2 SR / HARMONIZED: COPERNICUS datasets on GEE.
- Google Earth Engine: https://earthengine.google.com/

🧾 License
---------
Add an appropriate license file (e.g., MIT, Apache-2.0). This README does not change project licensing.

📫 Contact Author
---------
Tejas Chavan  
* GIS Expert at Government Of Maharashtra Revenue & Forest Department  
* tejaskchavan22@gmail.com  
* +91 7028338510  
---

Thank you for using this example — enjoy exploring Dynamic World + Sentinel-2!
