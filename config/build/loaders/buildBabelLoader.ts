import { type BuildOptions } from '../types/config';

export function buildBabelLoader({ isDev }: BuildOptions): object {
  return {
    test: /\.(js|jsx|ts|tsx)$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: [
          '@babel/preset-env',
        ],
        plugins: [

        ].filter(Boolean),
      },
    },
  };
}
