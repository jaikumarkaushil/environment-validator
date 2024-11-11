import cloudData from './cloud-data.json';
import config from './config.json';

interface ConfigEntry {
    provider: string;
    region: string;
    instanceType: string;
    zone?: string;  // zone is optional
}

class Validator {
    private cloudData: any;
    private config: ConfigEntry[];

    constructor(cloudData: any, config: ConfigEntry[]) {
        this.cloudData = cloudData;
        this.config = config;
    }

    // Validate the provider to ensure it exists in cloudData
    private validateProvider(entry: ConfigEntry): boolean {
        if (!this.cloudData[entry.provider]) {
            console.error(`Invalid provider '${entry.provider}'.`);
            return false;
        }
        return true;
    }

    // Validate the region for each provider
    private validateRegion(entry: ConfigEntry): boolean {
        const providerRegions = this.cloudData[entry.provider]?.regions; // Use optional chaining for safety
        if (!providerRegions || !providerRegions.includes(entry.region)) {
            console.error(`Invalid region '${entry.region}' for provider ${entry.provider}.`);
            return false;
        }
        return true;
    }

    // Validate the instance type for each provider
    private validateInstanceType(entry: ConfigEntry): boolean {
        const providerInstanceTypes = this.cloudData[entry.provider]?.instanceTypes; // Use optional chaining
        if (!providerInstanceTypes || !providerInstanceTypes.includes(entry.instanceType)) {
            console.error(`Instance type '${entry.instanceType}' is not supported in region '${entry.region}' for provider ${entry.provider}.`);
            return false;
        }
        return true;
    }

    // Validate the zone for each provider if the region has more than two zones
    private validateZone(entry: ConfigEntry): boolean {
        if (entry.zone) {
            // If a zone is provided, check if it's available for the specified region
            const providerZones = this.cloudData[entry.provider]?.zones[entry.region];
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
    public validate(): boolean {
        let isValid = true;

        // Iterate over each configuration entry and validate it
        this.config.forEach((entry: ConfigEntry) => {
            if (!this.validateProvider(entry)) isValid = false;  // Validate provider existence
            if (!this.validateRegion(entry)) isValid = false;    // Validate region
            if (!this.validateInstanceType(entry)) isValid = false; // Validate instance type
            if (!this.validateZone(entry)) isValid = false;      // Validate zone
        });

        return isValid;  // Return true if all entries are valid, otherwise false
    }
}

export default Validator;
