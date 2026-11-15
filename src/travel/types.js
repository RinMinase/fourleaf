/**
 * @typedef {Object} Item
 * @property {string} id
 * @property {string} name
 * @property {number} [value]
 */

/**
 * @typedef {Object} Category
 * @property {string} id
 * @property {null | number} [order]
 * @property {string} category
 * @property {Item[]} items
 */

/**
 * @typedef {Object} ListItem
 * @property {string} id
 * @property {string} name
 * @property {string} date
 * @property {Category[]} list
 */

export { };
