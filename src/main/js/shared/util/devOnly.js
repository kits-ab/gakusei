// Code executed within this function gets stripped in any production environment

function devOnly(context, func) {
  if (func) {
    func.call(context);
  }
  // If func is undefined/null, we assume that whatever's in context is just a function call that needed to be wrapped.
}

export default devOnly;
