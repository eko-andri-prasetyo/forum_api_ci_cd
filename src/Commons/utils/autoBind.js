/**
 * Simple auto-bind helper for CommonJS projects.
 * Binds all prototype methods (excluding constructor) to the instance.
 * This avoids repeating `this.method = this.method.bind(this)` in every handler.
 */
const autoBind = (self) => {
  const proto = Object.getPrototypeOf(self);
  const props = Object.getOwnPropertyNames(proto);

  props
    .filter((name) => name !== 'constructor' && typeof self[name] === 'function')
    .forEach((name) => {
      self[name] = self[name].bind(self);
    });
};

module.exports = autoBind;
