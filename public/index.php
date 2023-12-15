<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2018 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: liu21st <liu21st@gmail.com>
// +----------------------------------------------------------------------

// [ 应用入口文件 ]
namespace think;

// 加载基础文件
require __DIR__ . '/../thinkphp/base.php';

// 支持事先使用静态方法设置Request对象和Config对象

define('IMG_HTTP', 'http://fastdfs.moonarstore.com/');
//define('PRODUCT_SYSTEM_DOMAIN', 'http://pro.loc:8088');
define('PRODUCT_SYSTEM_DOMAIN', 'http://product.moonarstore.com');
//define('PRODUCT_SYSTEM_DOMAIN', 'http://erp_demo_product.moonarstore.com:5532');

// 执行应用并响应
Container::get('app')->run()->send();
