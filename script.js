document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const totalWeightInput = document.getElementById('totalWeight');
    const beefPercentInput = document.getElementById('beefPercent');
    const porkPercentInput = document.getElementById('porkPercent');
    const fatPercentInput = document.getElementById('fatPercent');
    const unitRadios = document.querySelectorAll('input[name="units"]');
    const inputs = [totalWeightInput, beefPercentInput, fatPercentInput]; // Input fields that trigger calculation

    // --- Base Recipe (per 4.5 kg total mixture) ---
    const baseWeightKg = 4.5;
    const baseRecipe = {
        salt_g: 35,
        coriander_g: 40,
        nutmeg_g: 2,
        cloves_g: 2,
        pepper_g: 6,
        vinegar_ml: 80,
        worcester_ml: 60,
        rosemary_g: 2,
        water_ml: 150
    };

    // --- Conversion Factors ---
    const KG_TO_LB = 2.20462;
    const G_TO_OZ = 0.035274;
    const ML_TO_FL_OZ = 0.033814;

    // --- Functions ---

    function calculateIngredients() {
        // Get current input values
        const totalWeightKg = parseFloat(totalWeightInput.value) || 0;
        let beefPercent = parseFloat(beefPercentInput.value) || 0;
        let fatPercent = parseFloat(fatPercentInput.value) || 0;

        // Validate percentages
        beefPercent = Math.max(0, Math.min(100, beefPercent));
        fatPercent = Math.max(0, Math.min(80, fatPercent)); // Limit fat to 80% max
        beefPercentInput.value = beefPercent; // Update input if corrected
        fatPercentInput.value = fatPercent;   // Update input if corrected

        const porkPercent = 100 - beefPercent;
        porkPercentInput.value = porkPercent; // Update the disabled pork input

        if (totalWeightKg <= 0) {
            clearResults(); // Clear results if total weight is invalid
            return;
        }

        // Calculate meat/fat components
        const totalFatKg = totalWeightKg * (fatPercent / 100);
        const totalLeanKg = totalWeightKg - totalFatKg;
        const beefKg = totalLeanKg * (beefPercent / 100);
        const porkKg = totalLeanKg * (porkPercent / 100);

        // Calculate scaling factor
        const scaleFactor = totalWeightKg / baseWeightKg;

        // Calculate ingredient amounts (Metric)
        const results = {
            beef_kg: beefKg,
            pork_kg: porkKg,
            fat_kg: totalFatKg,
            lean_kg: totalLeanKg,
            total_kg: totalWeightKg,
            salt_g: baseRecipe.salt_g * scaleFactor,
            coriander_g: baseRecipe.coriander_g * scaleFactor,
            nutmeg_g: baseRecipe.nutmeg_g * scaleFactor,
            cloves_g: baseRecipe.cloves_g * scaleFactor,
            pepper_g: baseRecipe.pepper_g * scaleFactor,
            vinegar_ml: baseRecipe.vinegar_ml * scaleFactor,
            worcester_ml: baseRecipe.worcester_ml * scaleFactor,
            rosemary_g: baseRecipe.rosemary_g * scaleFactor,
            water_ml: baseRecipe.water_ml * scaleFactor,
        };

        // Calculate Imperial values
        results.beef_lb = results.beef_kg * KG_TO_LB;
        results.pork_lb = results.pork_kg * KG_TO_LB;
        results.fat_lb = results.fat_kg * KG_TO_LB;
        results.lean_lb = results.lean_kg * KG_TO_LB;
        results.total_lb = results.total_kg * KG_TO_LB;
        results.salt_oz = results.salt_g * G_TO_OZ;
        results.coriander_oz = results.coriander_g * G_TO_OZ;
        results.nutmeg_oz = results.nutmeg_g * G_TO_OZ;
        results.cloves_oz = results.cloves_g * G_TO_OZ;
        results.pepper_oz = results.pepper_g * G_TO_OZ;
        results.rosemary_oz = results.rosemary_g * G_TO_OZ;
        results.vinegar_floz = results.vinegar_ml * ML_TO_FL_OZ;
        results.worcester_floz = results.worcester_ml * ML_TO_FL_OZ;
        results.water_floz = results.water_ml * ML_TO_FL_OZ;

        displayResults(results);
        updateUnitVisibility(); // Ensure units are displayed correctly after calculation
    }

    function displayResults(results) {
        // Display Metric values
        document.getElementById('beef-kg').textContent = results.beef_kg.toFixed(2);
        document.getElementById('pork-kg').textContent = results.pork_kg.toFixed(2);
        document.getElementById('fat-kg').textContent = results.fat_kg.toFixed(2);
        document.getElementById('lean-kg').textContent = results.lean_kg.toFixed(2);
        document.getElementById('total-kg').textContent = results.total_kg.toFixed(2);
        document.getElementById('salt-g').textContent = results.salt_g.toFixed(1);
        document.getElementById('coriander-g').textContent = results.coriander_g.toFixed(1);
        document.getElementById('nutmeg-g').textContent = results.nutmeg_g.toFixed(2);
        document.getElementById('cloves-g').textContent = results.cloves_g.toFixed(2);
        document.getElementById('pepper-g').textContent = results.pepper_g.toFixed(2);
        document.getElementById('rosemary-g').textContent = results.rosemary_g.toFixed(2);
        document.getElementById('vinegar-ml').textContent = results.vinegar_ml.toFixed(1);
        document.getElementById('worcester-ml').textContent = results.worcester_ml.toFixed(1);
        document.getElementById('water-ml').textContent = results.water_ml.toFixed(1);

        // Display Imperial values
        document.getElementById('beef-lb').textContent = results.beef_lb.toFixed(2);
        document.getElementById('pork-lb').textContent = results.pork_lb.toFixed(2);
        document.getElementById('fat-lb').textContent = results.fat_lb.toFixed(2);
        document.getElementById('lean-lb').textContent = results.lean_lb.toFixed(2);
        document.getElementById('total-lb').textContent = results.total_lb.toFixed(2);
        document.getElementById('salt-oz').textContent = results.salt_oz.toFixed(2);
        document.getElementById('coriander-oz').textContent = results.coriander_oz.toFixed(2);
        document.getElementById('nutmeg-oz').textContent = results.nutmeg_oz.toFixed(3); // More precision for small amounts
        document.getElementById('cloves-oz').textContent = results.cloves_oz.toFixed(3);
        document.getElementById('pepper-oz').textContent = results.pepper_oz.toFixed(3);
        document.getElementById('rosemary-oz').textContent = results.rosemary_oz.toFixed(3);
        document.getElementById('vinegar-floz').textContent = results.vinegar_floz.toFixed(2);
        document.getElementById('worcester-floz').textContent = results.worcester_floz.toFixed(2);
        document.getElementById('water-floz').textContent = results.water_floz.toFixed(2);
    }

    function clearResults() {
         // Clear all calculated values
         const resultSpans = document.querySelectorAll('.results span[id]');
         resultSpans.forEach(span => span.textContent = '-');
    }

    function updateUnitVisibility() {
        const selectedUnit = document.querySelector('input[name="units"]:checked').value;
        const metricVals = document.querySelectorAll('.metric-val');
        const metricUnits = document.querySelectorAll('.metric-unit');
        const imperialVals = document.querySelectorAll('.imperial-val');
        const imperialUnits = document.querySelectorAll('.imperial-unit');
        const separators = document.querySelectorAll('.separator');

        // Helper to set display style
        const setDisplay = (elements, displayStyle) => {
            elements.forEach(el => el.style.display = displayStyle);
        };

        // Reset all first
        setDisplay(metricVals, 'none');
        setDisplay(metricUnits, 'none');
        setDisplay(imperialVals, 'none');
        setDisplay(imperialUnits, 'none');
        setDisplay(separators, 'none');

        // Show based on selection
        if (selectedUnit === 'metric' || selectedUnit === 'both') {
            setDisplay(metricVals, 'inline');
            setDisplay(metricUnits, 'inline');
        }
        if (selectedUnit === 'imperial' || selectedUnit === 'both') {
            setDisplay(imperialVals, 'inline');
            setDisplay(imperialUnits, 'inline');
        }
        if (selectedUnit === 'both') {
            setDisplay(separators, 'inline');
        }
    }

    // --- Event Listeners ---

    // Calculate when relevant inputs change
    inputs.forEach(input => {
        input.addEventListener('input', calculateIngredients);
    });

    // Update visibility when unit selection changes
    unitRadios.forEach(radio => {
        radio.addEventListener('change', updateUnitVisibility);
    });
    
    // Special handling for beef percentage input to update pork percentage
    beefPercentInput.addEventListener('input', () => {
        let beefPercent = parseFloat(beefPercentInput.value) || 0;
        beefPercent = Math.max(0, Math.min(100, beefPercent)); // Clamp between 0 and 100
        const porkPercent = 100 - beefPercent;
        porkPercentInput.value = porkPercent.toFixed(0); // Update display (no decimals needed)
        // No need to call calculateIngredients here, as it's already called by the general input listener
    });

    // --- Initial Calculation on Load ---
    calculateIngredients(); 

}); // End DOMContentLoaded