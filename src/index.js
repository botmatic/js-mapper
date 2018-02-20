/**
 * Module to perform mapping operations between to schemas representing the same data
 * @module js-mapper
 * @example
 * // INITIALISATION PARAMETERS
 * // mappings: an array of Mapping objects (see typedef in Global)
 *
 * const mapper = require('js-mapper')(mappings)
 * @example
 * // map from a botmatic contact to external application
 * const mapped = mapper.mapTo(raw, 'botmatic', 'ext')
 *
 * @example
 * // map from an external application contact to botmatic's
 * const mapped = mapper.mapTo(raw, 'ext', 'botmatic')
 */

const debug = require('debug')('botmatic:js-mapper')

const defaultTransform = {
  botmatic: source_value => {
    if (Array.isArray(source_value) || typeof source_value === 'object') {
      source_value = JSON.stringify(source_value)
    }

    return source_value
  },

  ext: source_value => {
    try {
      if (typeof source_value === 'string') {
        source_value = JSON.parse(source_value)
      }

      return source_value
    }
    catch (_) {
      return source_value
    }
  }
}

/**
 * Returns a function to map data birectionnaly based on the mapping struct
 * @param {Mapping[]} mappings
 * @return {function}
 * @ignore
 */
const makeMapTo = (mappings) => (source_data, from, to) => {
  const result =  mappings.reduce((acc, mapping) => {
    const from_key = mapping[from].name
    const to_key = mapping[to].name
    const transform = mapping[to].transform

    debug(`from ${from_key} to ${to_key}`)

    if (source_data.hasOwnProperty(from_key)) {
      let source_value = source_data[from_key]

      if (source_value !== '' && source_value !== null && source_value !== undefined) {
        // If we need to JSON parse the value before hand
        source_value = defaultTransform[to](source_value)

        if (transform) {
          source_value = transform(source_value)
          // If we need to JSON stringify afterwards
          source_value = defaultTransform[to](source_value)
        }

        acc[to_key] = defaultTransform[to](source_value)
      }
    }
    else {
      debug(`key ${from_key} not found in source data`)
      debug(`source data has keys ${Object.keys(source_data).join(', ')}`)
    }

    return acc
  }, {})

  debug('result', result)

  return result
}

const makeGetExtIdKey = mappings =>
  () => {
    try {
      const idMapping = mappings.filter(m => m.id === true)
      debug('idMapping', idMapping)
      return idMapping[0].ext.name
    } catch (err) {
      console.error(err)
    }
  }

/**
 * Init function
 * @param {string} integrationId The integration id this module will interact with
 * @param {Mapping[]} mappings   An array of mappings
 * @param {Storage} storage      A module implementing the storage interface to store the id mappings
 * @return {{mapTo: function, ids: idmappings}}
 * @ignore
 */
const init = (mappings) => {
  debug("init mappgins")
  // (mappings)

  return {
    data: mappings,
    /**
     * Maps an object's properties from a schema to another
     * @member mapTo
     * @function
     * @param {object} object   The object to be mapped
     * @returns {object}  The mapped object
     */
    mapTo: makeMapTo(mappings),
    getExtIdKey : makeGetExtIdKey(mappings)
  }
}

module.exports = init