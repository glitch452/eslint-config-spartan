// export { remark as default } from './src/mixins/index.js';

import { remark, remarkPrettier } from './src/remark/index.js';

export default {
  plugins: [remark, remarkPrettier],
};
