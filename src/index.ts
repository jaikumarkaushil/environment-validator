import Validator from './validator';
import cloudData from './cloud-data.json';
import config from './config.json';

const validator = new Validator(cloudData, config);

if (validator.validate()) {
    console.log('All configurations are valid.');
} else {
    console.log('One or more configurations are invalid.');
}