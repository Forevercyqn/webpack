### 理解webpack配置

#### loader
`webpack`具备`js`的处理特性，如果要处理`js`之外的其他类型的文件，需要借助于`loader`,主要处理导入的非`js`的模块
例如：
对css文件的处理

安装`css-loader`:
```npm
  npm install css-loader -D
```
配置：
```js
// weboack.config.js
module.exports = {
  mode: 'development', //模式
  entry:'./src/main.css', //打包入口地址
  output: {
    filename:'bundle.css', //输出文件名
    path:path.join(__dirname, 'dist') //输出文件目录
  },
  module: {
    rules: [ //转换规则
      {
        test:/.css$/, //匹配所有css文件
        use:'css-loader' //use:对应的loader 使用css-loader解析器
      }
    ]
  }
}
```
打包：

```npm
npx webpack
```
查看`dist`文件夹，可以发现我们的输出文件`bundle.css`,打包成功。

>**Note：** 这里`loader`起了一个翻译的作用，将webpack不认识的`css`转换成了可以识别的内容。
---

#### 插件 （Plugin）
这是一项非常重要的功能，它是能使我们项目便捷化的基础

##### 注入模块插件 （html-webpack-plugin）

安装 `html-webpack-plugin`
```npm
npm install html-webpack-plugin -D(or --save-dev,指开发环境)
```
配置插件

```js
... //已有内容省略
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  ...//已有内容省略
  plugins:[ //插件配置
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ]
}
```

配置完成后打包，查看`dist`文件夹下的`index.html`文件
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>webpack_test</title>
  <script defer src="bundle.js"></script> //文件已经引入
</head>
<body>
  
</body>
</html>
```

##### 自动清除打包目录插件 （clean-webpack-plugin）
每次打包都会保留上一次打包生成的文件，在一定情况下可能对项目造成影响，为了保证每次打包都是最新的数据，我们需要在打包前将打包文件清空

安装：
```npm
npm i clean-webpack-plugin -D
```

配置
```js
...
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = {
  ...
  plugins:[
    ...
    new CleanWebpackPlugin()
  ]
}
```
---
#### 区分环境
本地开发和线上，需求通常存在一些差异：

本地环境（测试环境）：
- 需要更快的构建速度
- 需要打印`debug`信息
- 需要`live reload`或者`hot reload`功能
- 需要`sourceMap`方便定位信息
- 其他。。。

线上（生成环境）：
- 需要更小的包体积，代码压缩和`tree-shaking`
- 需要进行代码切割
- 需要压缩图片体积
- 。。。

为了处理不同的需求，环境的区分是必然的。

1、安装`cross-env`
```npm
npm install cross-env -D
```
2、配置启动命令

打开`package.json`文件，输入以下配置
```json
"scripts": {
    "dev": "cross-env NODE_ENV=dev webpack serve --mode development", (serve是启动devServer的命令)
    "test": "cross-env NODE_ENV=test webpack --mode production",
    "build": "cross-env NODE_ENV=prod webpack --mode production"
  },

```
3、 在`webpack.config.js`文件中获取环境变量
```js
console.log('process.env.NODE_ENV=', process.env.NODE_ENV)
```
分别运行启动命令
```npm
输入: npm run dev

输出：
process.env.NODE_ENV= dev
argv.mode= development

输入: npm run test

输出：
process.env.NODE_ENV= test
argv.mode= production

输入：npm run build

输出：
process.env.NODE_ENV= prod
argv.mode= production
```
由此我们可以就不同的环境来动态修改`Webpack`的配置

---
#### 启动本地服务

1、安装`webpack-dev-server`
```npm
npm i webpack-dev-server -D
```

2、配置本地服务

```js
const config = {
  ...
  devServer: {
    static: {
      dirctory:path.resolve(__dirname, 'public')
    }, // 静态文件目录
    compress: true, //是否启动压缩 gzip
    port: 8080, // 端口号
    // open:true  // 是否自动打开浏览器
  },
}

module.exports = (env,argv) => {
  //这里可以拿到环境变量，可以根据不同模式修改config的配置
  return config
}
```
配置`static`的作用
该配置项允许配置从目录提供静态文件的选项（默认是 'public' 文件夹）。将其设置为 false 以禁用.

```js
 //监听单个目录
 devServer: {
    static: ['assets'],
  }

//监听多个目录
devServer: {
    static: ['assets', 'css'],
  },

```

`directory`选项

告诉服务器从哪里提供内容。只有在你希望提供静态文件时才需要这样做。`static.publicPath` 将会被用来决定应该从哪里提供 `bundle`，并具有优先级。(静态文件获取路径)

```js

//单个静态文件路径
const path = require('path');

module.exports = {
  //...
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),//已此目录作为devServer的静态资源,不配置默认为public文件夹下，指定时取对应的内容
    },
  },
};

//多个静态文件路径

const path = require('path');

module.exports = {
  //...
  devServer: {
    static: [
      {
        directory: path.join(__dirname, 'assets'),
      },
      {
        directory: path.join(__dirname, 'css'),
      },
    ],
  },
};

```
>**Tip：** 以上路径推荐使用绝对路径

---

#### 引入CSS （style-loader）
虽然`css-loader`可以处理`css`,但是只使用`css-loader`无法将样式应用到页面上，这时候我们就需要借助`style-loader`

1、安装
```npm
npm i style-loader -D
```

2、配置Loader

```js
const config = {
  // ...
  module: { 
    rules: [
      {
        test: /\.css$/, //匹配所有的 css 文件
        use: ['style-loader','css-loader']
      }
    ]
  },
  // ...
}
```
> **NOTE:** `loader`的执行顺序是从右至左，在本案例上就是 `css-loader` -> `style-loader`



3、在入口文件`./src/index.js`出引入`main.css`
```js
import './main.css' //同目录下
```

重启服务后，可以发现样式已经应用上了。`CSS`文件中的代码被注入到了页面`style`标签内。修改样式文件，浏览器可以及时生效。

`style-loader`的核心代码

```js
const content = `${样式内容}`
const style = document.createElement('style');
style.innerHTML = content;
document.head.appendChild(style);
```


#### css兼容性处理 (postcss-loader)

很多`css3`属性在不同浏览器表现不同，需要添加独特的前缀来使其生效，因此我们可以引用`postcss-loader`来完成这项工作。

1、安装：
`postcss-loader`不能单独运行，需要依靠`postcss`及`postcss-preset-env`

```npm
npm i postcss postcss-loader postcss-preset-env -D
```
2、配置

- 添加`postcss-loader`
```js
{
  module: {
    rules: [{
      test: /\.css$/,
      use:['style-loader','css-loader','postcss-loader']
    }]
  }
}
```
  此时直接运行，会发现css3属性前缀增加并未生效

- 创建`postcss`配置文件`postcss.config.js`
```js
module.exports = {
  plugins: [require('postcss-preset-env')]
}
```

- 创建`.browserslistrc`文件
```nginx
# 换行相当于and
last 2 versions # 回退两个版本
> 0.5% # 全球超过0.5%的人使用的浏览器 可以通过 caniuse.com 查看不同浏览器使用占比
IE 10 #兼容IE10
```
完成上述操作可以发现样式前缀已添加上了。

#### 引入样式编程语言 `less`or`sass`

`less`与`sass`也需要对应的`loader`才能使用

`less`与 `sass`的对比

| 文件类型 | Loader|
| ---- | ---- |
| Less | less-loader|
| Sass | sass-loader,node-sass 或 dart-sass |


安装`less`
```npm
npm i less less-loader -D
```

创建 `.less`文件 (如果是安装的是`sass`，就创建`.scss`或`.sass`文件),写入样式

```less
@color: rgb(190, 23, 168);

body {
  p {
    background-color: @color;
    width: 300px;
    height: 300px;
    display: block;
    text-align: center;
    line-height: 300px;
  }
}
```

如果是 `sass`
```scss
$color: rgb(190, 23, 168);

body {
  p {
    background-color: $color;
    width: 300px;
    height: 300px;
    display: block;
    text-align: center;
    line-height: 300px;
  }
}
```

配置 `loader`
```js
 module: {
    rules: [
      {
        test:/.(s[ac]|c|le)ss$/i,
        use:['style-loader','css-loader', 'postcss-loader', 'less-loader'] //执行顺序从右至左，同flowRight
      }
    ]
  },
```
运行即可发现样式已成功加载。

---
#### 分离样式文件 （min-css-extract-plugin）
前面的所有样式我们都是依赖`style-loader`通过`style`标签的形式注入到`index.html`页面的,通常情况下，我们希望能通过`css`文件的形式添加到页面上

1、安装
```shell
npm i mini-css-extract-plugin -D
```

2、使用插件
```js
...
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //引入插件

const config = {
  module: {
    rules:[
       { //css规则
        test:/.(s[ac]|c|le)ss$/i,
        use:[
          // 'style-loader', //采用style标签的形式
          MiniCssExtractPlugin.loader,//采用css文件的形式
          'css-loader',
          'postcss-loader',
          'less-loader'
          ] //执行顺序从右至左，同flowRight
      }
    ]
  },
  plugins:[
    ...,
     new MiniCssExtractPlugin({ // 添加插件
      filename: '[name].[hash:8].css', //文件名形式
    }),
    ...
  ]
}

```

3、打包
可以发现`css`文件携带了8位`hash`值，且`index.html`正确引入了`css`

dist
|--main.b2c05c13.css
|-- index.html
|--bundle.js

---
#### 图片和字体文件的引入

可以发现我们上述打包文件中并未包含图片和字体文件,直接引用的文件未显示（可通过访问devServer静态资源的方式拿到，例如：localhost:8080/logo.png），背景图片可以正常显示出来（被css-loader处理）。

常见的处理图片文件的`Loader`


| Loader | 说明|
|---- | ---- |
| file-loader| 解决图片引入问题，并将图片copy到指定目录，默认为dist|
|url-loader |	依赖 file-loader，当图片小于 limit 值的时候，会将图片转为 base64 编码，大于 limit 值的时候依然是使用 file-loader 进行拷贝 |
|img-loader | 压缩图片|

> **Note:** webpack5内置了资源处理模块，可以不安装`url-loader`和`file-loader`

##### file-loader

安装`file-loader`
```shell
npm install file-loader -D
```
修改配置：
```js
const config =  {
  module: {
    rules: [
    ...
    {
      test: /\.(jpe?g|png|gif)$/i,
      use:[
        'file-loader'
      ]
    }
  ]
  },
  ...
}
```

js文件引入：

```js
import './main.css';
import './sass.scss'
import logo from '../public/avatar.png'

const a = 'Hello ITEM'
console.log(a)

const img = new Image()
img.src = logo

document.getElementById('imgBox').appendChild(img)

```
启动服务，可以发现图片正常显示,图片名称带上了`hash`值。

可以自定义输出名称格式
```js
const config = {
  module: {
    rules: [
      ...,
      {
        test: /\.(jpe?g|png|gif)$/i,
        use: [
          {
            loader:'file-loader',
            options: {
              name:'[name]_[hash:8].[ext]'
            }
          }
        ]
      }
    ]
  }
}

//当只有file-loader用来处理图片文件时，可以简化为：
rules: [
  {
    test: /\.(jpe?g|png|gif)$/i,
    loader:'file-loader',
    options: {
      name:'[name]_[hash:8].[ext]'
    }
  }
]

```
> **Tip** 关于更细致的配置，可查看官方文档 [rule.use](https://webpack.docschina.org/configuration/module/#ruleuse)

#### url-loader

关于`url-loader`，它在`file-loader`的基础上增加了一个`options.limit`的配置，当图片大小小于所配置的值时，图片会被转化为`base64`格式。

```js
...
rules: [
  {
    ...
    use: [
      {
        loader:'url-loader',
        options:{
          ...
          limit: 40 * 1024 // 40K
        }
      }
    ]
  }
]
```

##### 字体文件使用

下载字体文件到本地

在项目中新建`src/fonts`来存放字体文件

引入到入口文件

在`index.html`文件中使用

字体及文件的配置
```js
const config = {
  // ...
  {
    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,  // 匹配字体文件
    use: [
      {
        loader: 'url-loader',
        options: {
          name: 'fonts/[name][hash:8].[ext]', // 体积大于 10KB 打包到 fonts 目录下 
          limit: 10 * 1024,
        } 
      }
    ]
  },
  // ...
}

```

#### 使用资源模块处理

`webpack5`新增资源模块（asset module）,允许使用资源文件（图标、字体等）时无需配置额外的`loader`

##### 资源模块支持四个配置

1、asset/resource 将资源分割为单独的文件，并导出 url，类似之前的 file-loader 的功能.

2、asset/inline 将资源导出为 dataUrl 的形式，类似之前的 url-loader 的小于 limit 参数时功能.

3、 asset/source 将资源导出为源码（source code）. 类似的 raw-loader 功能.

4、asset 会根据文件大小来选择使用哪种类型，当文件小于 8 KB（默认） 的时候会使用 asset/inline，否则会使用 asset/resource

##### 配置

```js
// ./src/index.js

const config = {
  // ...
  module: { 
    rules: [
      // ... 
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
    ]
  },
  // ...
}

module.exports = (env, argv) => {
  console.log('argv.mode=',argv.mode) // 打印 mode(模式) 值
  // 这里可以通过不同的模式修改 config 配置
  return config;
}

```

---
#### `JS`代码兼容
开发中我们通常更倾向使用最新的`js`特性,但是如果就用这样的代码发布到生产环境，很容易出现无法使用的情况。面对这种情况，我们可以使用`babel`来处理`js`兼容性。

##### 安装`babel`
```js
 npm install babel-loader @babel/core @babel/preset-env -D
```
工具作用
 - `babel-loader`使用`Babel`加载`ES2015+`代码并将其转化为`ES5`
 - `@babel/core` `Babel`编译的核心包
 - `@babel/preset-env` `Babel`编译的预设，可以理解成`Babel`插件的超集


##### 配置`Babel`

```js
// webpack.config.js
// ...
const config = {
  entry: './src/index.js', // 打包入口地址
  output: {
    filename: 'bundle.js', // 输出文件名
    path: path.join(__dirname, 'dist'), // 输出文件目录
  },
  module: { 
    rules: [
      {
        test: /\.js$/i,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env'
              ],
            }
          }
        ]
      },
    // ...
    ]
  },
  //...
}
// ...


```

配置完成后执行打包，可以发现`js`代码已经转化成`ES5`规范

> **Note:**将`webpack.config.js`文件中的`mode`属性修改为`none`，可以更直观的看到输出的js文件内容。

##### 指定兼容内容，提取`babel`配置

在项目根目录新建 `babelrc.js`, 写入`babel`配置

```js
module.exports = {
  preset: [
    [
      '@babel/preset-env',
      {
         // useBuiltIns: false 默认值，无视浏览器兼容配置，引入所有 polyfill
        // useBuiltIns: entry 根据配置的浏览器兼容，引入浏览器不兼容的 polyfill
        // useBuiltIns: usage 会根据配置的浏览器兼容，以及你代码中用到的 API 来进行 polyfill，实现了按需添加
        corejs:'3', //core-js的版本号
        targets: {
          chrome:'58',
          ie:'11'
        }
      }
    ]
  ]
}
```

Babel的其它扩展插件在此就不在介绍了，实际项目需求再进行实际扩展。
- @babel/preset-flow flow静态类型检查
- @babel/preset-react react转化
- @babel/preset-typescript typeScript特性兼容

---


#### SourceMap

`SourceMap`是一种映射关系，当项目运行后，如果出现错误，我们可以利用SourceMap反向定位到源码的位置。

devTool配置

```js
const config = {
  entry: './src/index.js',
  output: {
    filename:'bundle.js',
    path: path.join(__dirname, 'dist'),
  },
  devtool:'source-map',
  module:{

  },
  plugins:{

  }
}
```

配置完成后，`dist`目录会生成`.map`结尾的`SourceMap`文件.

除了 `sourceMap`之外，还有很多类型可以用，例如：
- eval
- eval-source-map
- cheap-source-map
- inline-source-map
- eval-cheap-source-map
- cheap-module-source-map
- inline-cheap-source-map
- eval-cheap-module-source-map
- inline-cheap-module-source-map
- hidden-source-map
- nosources-source-map

验证不同类型的区别

多入口输出配置
```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
console.log('process.env.NODE_ENV=', process.env.NODE_ENV)

const config = [
  {
    mode: 'development',
    entry:'./src/index.js',
    output: {
      filename:'bundle.js',
      path:path.join(__dirname, 'dist')
    },
  },
  {
    entry: './src/index.js',
    output:{
      filename:'a.js'
    }
  },
  {
    entry: './src/index.js',
    output: {
      filename:'b.js'
    }
  }
]

const extract = {
  devtool:'source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, 'assets')
    }, // 静态文件目录,指定后，可以直接到本地pulic文件夹寻找静态文件，而不是
    compress: true, //是否启动压缩 gzip
    // port: 8082, // 端口号y
    open:true  // 是否自动打开浏览器
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
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[hash:8].css'
    }),
    new CleanWebpackPlugin()
  ]
}

module.exports = config.map(item => {
  return Object.assign(item, extract)
})


```

验证不同类型`source-map`打包后的区别

修改`webpack`配置

```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const allMode = [
  'eval',
  'source-map',
  'eval-source-map',
  'cheap-source-map',
  'inline-source-map',
  'eval-cheap-source-map',
  'cheap-module-source-map',
  'inline-cheap-source-map',
  'eval-cheap-module-source-map',
  'inline-cheap-module-source-map',
  'hidden-source-map',
  'nosources-source-map'
]
module.exports = allMode.map(item=> {
  return {
    devtool: item,
    mode:'none',
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
        filename: `./${item}.html` //输出到不同的页面
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[hash:8].css'
      }),
      // new CleanWebpackPlugin()
    ]
  }
})

```

打包后，可以发现，以`inline`,`eval`,`cheap`开头的`js`文件都没有对应的`map`文件。

不同模式的区别

> eval 模式

生成的代码通过`eval`执行

源代码位置通过`sourceURL`注明

无法定位到错误位置，只能定位到**某个文件**

不用生成SourceMap文件，**打包速度快**

> source-map 模式

生成了对应的`source-map`文件，**打包速度慢**

在**源代码**中定位到错误所在**行列**信息

> eval-source-map 模式

生成代码通过`eval`·执行

包含`DataUrl`形式的`sourceMap`文件
```map
sourceMappingURL=data:application/json;charset=utf-8;base64,...
```
可以在**编译后**的代码中定位到错误所在**行列**信息

生成`DataUrl`形式的sourceMap,**打包速度慢**

> eval-cheap-source-map 模式

生成代码通过`eval`执行

包含`dataUrl`形式的`sourceMap`文件

可以在`编译后`的代码中定位到代码所在`行`的信息

不需要定位列信息，打包速度快

> eval-cheap-module-source-map 模式

生成代码通过`eval`执行

包含`dataUrl`形式的`sourceMap`文件

可以在`编译后`的代码中定位到代码所在`行`的信息

不需要定位列信息，打包速度快

在源代码中定位到错误所在行信息

> inline-source-map 模式

通过 dataUrl 的形式引入 SourceMap 文件 （注释引入，非嵌入方式，与包含形式不同）

> hidden-source-map 模式

看不到 SourceMap 效果，但是生成了 SourceMap 文件

或许有其他明面上无法观察到的内涵？

> nosources-source-map 模式

能看到报错具体信息，但不能看到对应的源代码



##### sourceMap总结

devtool不同类型的对比

| devtool | build| rebuild | 显示代码 | sourceMap文件|描述|
| --- | --- | --- |---| ---|---|
|none| 很快|很快 |无 |无 |无法定位错误 |
|eval | 快|很快（cache） |编译后 |无 |定位到文件 |
|source-map|很慢 |很慢 |源代码 |有 |定位到行列 |
|eval-source-map|很慢 |一般（cache） |编译后 |有（dataUrl）|定位到行列 |
|eval-cheap-source-map |一般 |快（cache） |编译后 |有（dataUrl）|定位到行 |
|eval-cheap-module-source-map|慢 |快（cache）|源代码 |有（dataUrl） |定位到行 |
| inline-source-map|很慢 |很慢 |源代码 |有（dataUrl）|定位到行列 |
| hidden-source-map |很慢 |很慢 |源代码 |有 |有错误信息，无法定位错误 |
|nosource-source-map|很慢 |很慢 |源代码 |无 |定位到文件 |
|

对照校验规则`^(inline-|hidden-|eval-)?(nosources-)?(cheap-(module-)?)?source-map$`,分析关键字打头

| 关键字 | 描述|
|:-----:|---|
|inline|代码内通过`dataUrl`的形式引入`sourceMap`|
|hidden| 生成`sourceMap`文件，但不使用|
|eval| `eval(...)`形式执行代码，通过`dataUrl`形式引入`sourceMap`
|nosources| 不生成`SourceMap`|
|cheap|只需定位到行信息，不需要列信息|
|module|展现源代码中错误的地方|
|

##### 推荐配置

本地开发：

使用`eval-cheap-module-source-map`

理由：
- 本地开发首次打包慢点没关系，因为有cache，rebuild较快
- 开发中，结合实际情况，错误定位到行信息即可，因此加上`cheap`
- 我们希望能够找到源代码中的错误，因此加上`module`

生产环境：

推荐使用`none`，

- 不暴露源代码


##### 三种`hash`值

`webpack`文件指纹策略是在文件名后面加上`hash`值，可以解决缓存问题。

占位符`[]`的意义

|占位符|解释|
|---|---|
|ext| 文件后缀名|
|name| 文件名|
|path|文件的相对路径|
|folder| 文件所在文件夹|
|hash|每次构建生成唯一的hash值|
|chunkhash|根据chunk生成hash值|
|contenthash|根据内容生成hash值|

表中三种`hash`的区别
- hash 任何一个文件改动，整个项目的构建hash值都会改变
- chunkhash 文件的改动只会影响其所在chunk的hash值
- contenthash 每个文件都有其单独的hash值，文件的改动只会影响自身的hash值



---




### webpack进阶

#### 优化构建速度

##### 构建耗时分析

使用插件 `speed-measure-webpack-plugin`

安装

```shell
npm i speed-measure-webpack-plugin -D
```

修改webpack配置

```js
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin');

const smp = new SpeedMeasureWebpackPlugin()
...

const config = {
  ...//webpack的配置
}

module.exports = (env, argv) = > {
  return smp.wrap(config)
}

```
执行打包报错，**有些loader或Plugin新版本会有不兼容的问题，需要做降级处理**

```shell
ERROR in ./src/main.css
Module build failed (from ./node_modules/mini-css-extract-plugin/dist/loader.js):
Error: You forgot to add 'mini-css-extract-plugin' plugin (i.e. `{ plugins: [new MiniCssExtractPlugin()] }`), please read https://github.com/webpack-contrib/mini-css-extract-plugin#getting-started
```


当前使用版本
```js
"mini-css-extract-plugin": "^2.4.3",
```

降级版本

```shell
npm i mini-css-extract-plugin@1.3.6 -D
```

重新打包成功
第一次打包耗时`26921ms`,第二次打包耗时`4022ms`，效率大幅度提升

> **Note:** 为了使用费时分析去对插件进行降级或修改配置是非常不利的，平时开发时不建议使用，可在需要优化时引入。

##### 优化resolve配置
###### 别名 alias
alias用的创建`import` 或 `require`的别名，用来简化模块引入，项目中基本都配置有别名。

```js
const conifg = {
  ...
  resolve: {
      //配置别名
      alias: {
        '~': path.join(__dirname, 'src'),
        '@': path.join(__dirname, 'src'),
        'components': path.join(__dirname,'src/components')
      }
    }
}

```

配置完成后，我们就可以使用别名来引入文件了。

###### 扩展名 extensions

webpack的默认配置
```js
resolve: {
  extensions: ['.js', '.json', '.wasm'],
}
```
如果引入的模块未带有扩展名，webpack就会默认的按照`extensions`**从左到右**的顺序去尝试解析模块

根据这种特性,意味着高频使用文件的后缀名应当放置在第一位。

手动配置后，默认配置会被覆盖。如果想保留默认配置，可以使用`...`来表示默认配置

```js
resolve: {
  extensions: ['.ts', '.vue','...']
}
```

###### modules

告诉webpack解析目录时应当访问的目录

```js
resovle: {
  modules:[path.join(__dirname, 'src'),'node_modules'],//优先src目录，其次node_modules
}
```
###### resloveLoader
配置自定义loader时使用，默认查找node_modules
```js
  //与resolve同级
  resolveLoader: {
    modules:['node_modules', path.join(__dirname, 'loader')]
  }
```

##### externals

externals 配置选项提供了「从输出的 bundle 中排除依赖」的方法。此功能通常对 library 开发人员来说是最有用的，然而也会有各种各样的应用程序用到它。

例如：`jquery`这种插件，可以使用这种方式来剥离，节省打包时间
```js
externals: {
  jquery: 'jQuery'
}
```

##### 缩小查找范围

使用`include`和`exclude`两个配置项，我们可以更精确的去指定`loader`的作用目录或者需要排除的目录。

- include 符合条件的模块进行解析
- exclude 排除符合条件的模块，不解析，优先级高于include

```js
module: {
  noParse:/jquery|lodash/,
  rules:[
    {
      test:'/\.js$/i',
      include: path.join(__dirname, 'src'),
      exclude: /node_modules/,
      use:[
        'babel-loader'
      ]
    }
  ]
}
```

##### noParse
- 不需要解析依赖的第三方大型类库等，可以通过这个字段进行配置，以提高构建速度
- 使用 noParse 进行忽略的模块文件中不会解析 import、require 等语法

##### IgnorePlugin
防止在 import 或 require 调用时，生成以下正则表达式匹配的模块：

- requestRegExp 匹配(test)资源请求路径的正则表达式。
- contextRegExp 匹配(test)资源上下文（目录）的正则表达式。

```js
new webpack.IgnorePlugin({ resourceRegExp, contextRegExp });
```

##### 多进程

> **Note:** 实际上在小型项目，开启多进程打包会增加时间成本，因为启动进程和进程间通信有一定的开销。

###### thread-loader
配置在 `thread-loader`之后的`loader`都会在一个单独的`worker`池（worker pool）中运行

安装
```sh
npm i -D thread-loader

```
配置

```js
const config = {
  module: {
    rules: [
      {
        test: /\.js$/i,
        include: path.join(__dirname,'src'),
        exclude: /node_modules/,
        use: [
          {
            loader: 'thread-loader', // 开启多进程打包
            options: {
              worker: 3,
            }
          },
          'babel-loader',
        ]
      }
    ]
  }
}

```

##### 利用缓存

利用缓存可以大幅提升重新构建的速度

###### babel-loader开启缓存

- babel 在转译 js 过程中时间开销比价大，将 babel-loader 的执行结果缓存起来，重新打包的时候，直接读取缓存
- 缓存位置： node_modules/.cache/babel-loader

配置

```js
const config = {
 module: { 
    noParse: /jquery|lodash/,
    rules: [
      {
        test: /\.js$/i,
        include: resolve('src'),
        exclude: /node_modules/,
        use: [
          // ...
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true // 启用缓存
            }
          },
        ]
      },
      // ...
    ]
  }
}

```

###### 其他loader如何缓存

cache-loader
- 缓存一些性能开销比较大的 loader 的处理结果
- 缓存位置：node_modules/.cache/cache-loader

安装
```shell
$ npm i -D cache-loader
```

配置
```js
const config = {
 module: { 
    // ...
    rules: [
      {
        test: /\.(s[ac]|c)ss$/i, //匹配所有的 sass/scss/css 文件
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          'cache-loader', // 获取前面 loader 转换的结果
          'css-loader',
          'postcss-loader',
          'sass-loader', 
        ]
      }, 
      // ...
    ]
  }
}

```

#### 优化构建结果

##### 构建结果分析

借助插件 webpack-bundle-analyzer 我们可以直观的看到打包结果中，文件的体积大小、各模块依赖关系、文件是够重复等问题，极大的方便我们在进行项目优化的时候，进行问题诊断。

安装
```shell
 npm i -D webpack-bundle-analyzer
```

配置

webpack
```js
//引入
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

plugins:[
  new BundleAnalyzerPlugin({
        analyzerMode: 'disabled',  // 不启动展示打包报告的http服务器
        generateStatsFile: true, // 是否生成stats.json文件
}),
]
```

package.json

```json
 "analyzer": "cross-env NODE_ENV=prod webpack --progress --mode production"
```

执行编译
```shell
npm run analyzer
```

###### 压缩css

安装
```shell
npm i -D optimize-css-assets-webpack-plugin
```

修改配置

```js
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const config = {
  // ...
  optimization: {
    minimize: true,
    minimizer: [
      // 添加 css 压缩配置
      new OptimizeCssAssetsPlugin({}),
    ]
  },
 // ...
}

```

打包查看结果。


##### 压缩js

> 在生产环境下打包默认会开启 js 压缩，但是当我们手动配置 optimization 选项之后，就不再默认对 js 进行压缩，需要我们手动去配置。

因为 webpack5 内置了terser-webpack-plugin 插件，所以我们不需重复安装，直接引用就可以了，具体配置如下

```js
const TerserPlugin = require('terser-webpack-plugin');

const config = {
  // ...
  optimization: {
    minimize: true, // 开启最小化
    minimizer: [
      // ...
      new TerserPlugin({})
    ]
  },
  // ...
}

```

##### 清除无用的css

`purgecss-webpack-plugin` 会单独提取 CSS 并清除用不到的 CSS

安装：

```shell
 npm i -D purgecss-webpack-plugin
```

添加配置

```js
// ...
const PurgecssWebpackPlugin = require('purgecss-webpack-plugin')
const glob = require('glob'); // 文件匹配模式
// ...

function resolve(dir){
  return path.join(__dirname, dir);
}

const PATHS = {
  src: resolve('src')
}

const config = {
  plugins:[ // 配置插件
    // ...
    new PurgecssPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`, {nodir: true})
    }),
  ]
}
```

##### 剔除无用代码 tree-shaking

webpack默认支持，在`.babelrc`文件中设置`module:true`，即可在生产环境默认开启。


##### Scope Hoisting
Scope Hoisting 即作用域提升，原理是将多个模块放在同一个作用域下，并重命名防止命名冲突，通过这种方式可以减少函数声明和内存开销。
- webpack默认支持，在生产环境默认开启
- 只支持Es6

---
#### 运行时优化

运行时优化的核心就是提升首屏的加载速度，主要的方式就是

- 降低首屏加载文件体积，首屏不需要的文件进行预加载或者按需加载

##### 入口点分割

配置多个打包入口，多页打包

##### splitChunks分包配置

`optimization.splitChunks` 是基于` SplitChunksPlugin` 插件实现的
默认情况下，它只会影响到按需加载的 chunks，因为修改 initial chunks 会影响到项目的 HTML 文件中的脚本标签。
webpack 将根据以下条件自动拆分 chunks：

- 新的 `chunk` 可以被共享，或者模块来自于 `node_modules` 文件夹
- 新的 chunk 体积大于 `20kb`（在进行 min+gz 之前的体积）
- 当按需加载 chunks 时，并行请求的最大数量小于或等于 30
- 当加载初始化页面时，并发请求的最大数量小于或等于 30

默认配置
```js
...
 optimization: {
    splitChunks: {
      chunks: 'async', // 有效值为 `all`，`async` 和 `initial`
      minSize: 20000, // 生成 chunk 的最小体积（≈ 20kb)
      minRemainingSize: 0, // 确保拆分后剩余的最小 chunk 体积超过限制来避免大小为零的模块
      minChunks: 1, // 拆分前必须共享模块的最小 chunks 数。
      maxAsyncRequests: 30, // 最大的按需(异步)加载次数
      maxInitialRequests: 30, // 打包后的入口文件加载时，还能同时加载js文件的数量（包括入口文件）
      enforceSizeThreshold: 50000,
      cacheGroups: { // 配置提取模块的方案
        defaultVendors: {
          test: /[\/]node_modules[\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
...
```

项目中使用
```js
const config = {
  //...
  optimization: {
    splitChunks: {
      cacheGroups: { // 配置提取模块的方案
        default: false,
        styles: {
            name: 'styles',
            test: /\.(s[ac]ss|less|css)$/,
            chunks: 'all',
            enforce: true,
            priority: 10,
          },
          common: {
            name: 'chunk-common',
            chunks: 'all',
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 0,
            priority: 1,
            enforce: true,
            reuseExistingChunk: true,
          },
          vendors: {
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            priority: 2,
            enforce: true,
            reuseExistingChunk: true,
          },
         // ... 根据不同项目再细化拆分内容
      },
    },
  },
}
```

##### 代码懒加载


##### perfetch与preload

###### prefetch 预拉取
浏览器空闲的时候进行资源的拉取
通过`import().then`的方式

###### preload 预加载

- preload (预加载)：提前加载后面会用到的关键资源
- ⚠️ 因为会提前拉取资源，如果不是特殊需要，谨慎使用

示例
```js
import(/* webpackPreload: true */ 'ChartingLibrary');
```





参考文章：

[1] https://juejin.cn/post/7023242274876162084

[2] 
