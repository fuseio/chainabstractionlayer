const path = require('path')
const cwd = process.cwd()
const pkg = require(path.join(cwd, 'package.json'))
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const isProdEnv = process.env.NODE_ENV === 'production'
const isWatchEnv = process.env.WEBPACK_WATCH === 'true'

const plugins = []

if (isProdEnv) {
  if (process.env.BUILD_PKG_STATS === 'true') {
    const base = path.join(__dirname, '..', 'doc', 'pkg-stats', path.basename(cwd))

    plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: path.join(base, 'index.html'),
        openAnalyzer: false,
        generateStatsFile: true,
        statsFilename: path.join(base, 'stats.json')
      })
    )
  }
}

module.exports = {
  devtool: 'inline-source-map',
  entry: './lib/index.ts',
  mode: isProdEnv ? 'production' : 'development',
  watch: isWatchEnv,
  target: 'node',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-typescript']
        }
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
    fallback: {
      buffer: require.resolve('buffer'),
      stream: require.resolve('stream-browserify')
    }
  },
  output: {
    filename: path.basename(pkg.main),
    path: path.resolve(cwd, 'dist'),
    library: {
      type: 'commonjs2'
    }
  },
  plugins,
  optimization: {
    usedExports: true // TODO: how to enable tree shaking on commonjs internal and modules? tsconfig should be esnext?
  }
}
