const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const smp = new SpeedMeasureWebpackPlugin()

const PurgecssWebpackPlugin = require('purgecss-webpack-plugin') //清除多余的css
const glob = require('glob');

const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin') //css压缩
const TerserPlugin = require('terser-webpack-plugin');
const { default: purgecssWebpackPlugin } = require('purgecss-webpack-plugin');

const allMode = [
  // 'eval',
  // 'source-map',
  // 'eval-source-map',
  // 'cheap-source-map',
  // 'inline-source-map',
  // 'eval-cheap-source-map',
  // 'cheap-module-source-map',
  // 'inline-cheap-source-map',
  'eval-cheap-module-source-map',
  // 'inline-cheap-module-source-map',
  // 'hidden-source-map',
  // 'nosources-source-map'
]

const config = allMode.map(item=> {
  return {
    devtool: item,
    devServer: {
          static: {
            directory: path.join(__dirname, 'assets')
          }, // 静态文件目录,指定后，可以直接到本地pulic文件夹寻找静态文件，而不是
          compress: true, //是否启动压缩 gzip
          // port: 8082, // 端口号y
          open:true  // 是否自动打开浏览器
    },
    mode:'development',
    entry:"./src/index.js",
    output: {
      filename: `js/${item}.js`,
      path:path.join(__dirname, 'dist')
    },
    module: {
      rules: [
        {
          test:/.(s[ac]|c|le)ss$/i, //css文件
          use:[
            // 'style-loader',
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            'less-loader'
            ] //执行顺序从右至左，同flowRight
        },
        {
          test: /\.(jpe?g|png|gif)$/i,
          type: 'asset',
          generator: {
            // 输出文件位置以及文件名
            // [ext] 自带 "." 这个与 url-loader 配置不同
            filename: "[name][hash:8][ext]"
          },
          parser: {
            dataUrlCondition: {
              maxSize: 50 * 1024 //超过50kb不转 base64
            }
          }
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
          type: 'asset',
          generator: {
            // 输出文件位置以及文件名
            filename: "[name][hash:8][ext]"
          },
          parser: {
            dataUrlCondition: {
              maxSize: 10 * 1024 // 超过100kb不转 base64
            }
          }
        },
        {
          test: /\.js$/i,
          use: [{
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }]
        }
      ]
    },
    plugins:[
      new HtmlWebpackPlugin({
        template:'index.html'
        // filename: `./${item}.html` //输出到不同的页面
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[hash:8].css'
      }),
      new BundleAnalyzerPlugin({
        analyzerMode: 'disabled',  // 不启动展示打包报告的http服务器
        generateStatsFile: true, // 是否生成stats.json文件
     }),
     new PurgecssWebpackPlugin({
      paths: glob.sync(`${path.join(__dirname, 'src')}/**/*`, {nodir:true})
     }),
      new CleanWebpackPlugin()
    ],
    resolve: {
      //配置别名
      alias: {
        '~': path.join(__dirname, 'src'),
        '@': path.join(__dirname, 'src'),
        'components': path.join(__dirname,'src/components')
      },
      extensions: ['.ts', '.vue','...'],
      modules: [path.join(__dirname, 'src'), 'node_modules']
    },
    externals: {
      Jquery:'jQuery'
    },
    optimization: {
      minimize: true, //开启最小化
      minimizer: [
        //添加css压缩配置
        new OptimizeCssAssetsPlugin({}),
        //js压缩
        new TerserPlugin({})
      ],
    }
  }
})[0]


module.exports = (env, argv) => {
  return smp.wrap(config)
}
