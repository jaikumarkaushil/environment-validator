"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Validator {
    constructor(cloudData, config) {
        this.cloudData = cloudData;
        this.config = config;
    }
    // Validate the provider to ensure it exists in cloudData
    validateProvider(entry) {
        if (!this.cloudData[entry.provider]) {
            console.error(`Invalid provider '${entry.provider}'.`);
            return false;
        }
        return true;
    }
    // Validate the region for each provider
    validateRegion(entry) {
        var _a;
        const providerRegions = (_a = this.cloudData[entry.provider]) === null || _a === void 0 ? void 0 : _a.regions; // Use optional chaining for safety
        if (!providerRegions || !providerRegions.includes(entry.region)) {
            console.error(`Invalid region '${entry.region}' for provider ${entry.provider}.`);
            return false;
        }
        return true;
    }
    // Validate the instance type for each provider
    validateInstanceType(entry) {
        var _a;
        const providerInstanceTypes = (_a = this.cloudData[entry.provider]) === null || _a === void 0 ? void 0 : _a.instanceTypes; // Use optional chaining
        if (!providerInstanceTypes || !providerInstanceTypes.includes(entry.instanceType)) {
            console.error(`Instance type '${entry.instanceType}' is not supported in region '${entry.region}' for provider ${entry.provider}.`);
            return false;
        }
        return true;
    }
    // Validate the zone for each provider if the region has more than two zones
    validateZone(entry) {
        var _a;
        if (entry.zone) {
            // If a zone is provided, check if it's available for the specified region
            const providerZones = (_a = this.cloudData[entry.provider]) === null || _a === void 0 ? void 0 : _a.zones[entry.region];
            if (providerZones && providerZones.length >= 3) {
                if (!providerZones.includes(entry.zone)) {
                    console.error(`Zone '${entry.zone}' is not available for region '${entry.region}' in ${entry.provider}.`);
                    return false;
                }
            }
        }
        return true;
    }
    // The main validation function that iterates over all entries and validates them
    validate() {
        let isValid = true;
        // Iterate over each configuration entry and validate it
        this.config.forEach((entry) => {
            if (!this.validateProvider(entry))
                isValid = false; // Validate provider existence
            if (!this.validateRegion(entry))
                isValid = false; // Validate region
            if (!this.validateInstanceType(entry))
                isValid = false; // Validate instance type
            if (!this.validateZone(entry))
                isValid = false; // Validate zone
        });
        return isValid; // Return true if all entries are valid, otherwise false
    }
}
exports.default = Validator;
