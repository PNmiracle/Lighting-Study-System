import handler from 'vinext/server/app-router-entry';

export default {
  fetch(request, env, ctx) {
    return handler.fetch(request, env, ctx);
  }
};
