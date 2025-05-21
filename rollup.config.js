import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import size from '@justinribeiro/rollup-plugin-asset-build-size-compare';

export default [
  {
    input: 'src/index.js',
    treeshake: true,
    output: [
      {
        file: 'tiny-ga4.js',
        format: 'esm',
      },
      {
        file: 'tiny-ga4.esm.min.js',
        format: 'esm',
        plugins: [
          terser({
            compress: {
              inline: 0,
              drop_console: true,
              ecma: 2022,
            },
            output: {
              comments: false,
            },
          }),
          size({
            compression: 'brotli',
            filename: '.build-size-brotli.json',
          }),
          size({
            compression: 'gzip',
            filename: '.build-size-gzip.json',
          }),
        ],
      },
    ],
  },
];
