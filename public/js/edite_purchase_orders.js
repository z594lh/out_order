function loadEvents(img_http) {
    layui.use(['form', 'laydate','upload'], function(){
        var form = layui.form
            ,layer = layui.layer
            ,laydate = layui.laydate
            ,upload = layui.upload;

        //日期
        lay(".arrival_date").each(function (){
            laydate.render({
                elem:this,
                trigger:'click'
            })
        })

        //删除 lay-key  属性
        $(".arrival_date").removeAttr("lay-key");

        /*只绑定新增的。否则重复绑定会导致upload组件失效*/
        var group_length =  $('.layui-menu-item-group').length;
        $('.layui-menu-item-group').each(function (index, element) {
            if(index == group_length - 1){
                /*上传图片*/
                var that = null;
                $('.uploadImage').on('click',function () {
                    that = $(this);
                })
                /*上传*/
                upload.render({
                    elem: $(element).find('.uploadImage'), //绑定元素
                    url: img_http+'pic_upload.php', //上传接口
                    accept: 'images', //接收文件类型
                    exts: 'jpg|jpeg|png|bmp', //文件后缀
                    size: 1024 * 10, //文件大小限制
                    before: function(obj) {
                        obj.preview(function(index, file, result){
                            that.parents('.dd').find('img').addClass('_show')//预览图片
                            that.parents('.dd').find('img').attr('src',result)//预览图片
                            that.parents('.dd').find('p').html(file.name);//显示文件名
                        });
                    },
                    done: function(res){
                        if(res.status === 200){ //上传成功
                            that.parents('.dd').find('input').eq(1).val(res.datas); //保存上传图片路径
                            layer.msg('上传成功');
                        }else{ //上传失败
                            layer.msg(res.msg, {icon: 2});
                        }
                    },
                    error: function(){
                        //请求异常回调
                        layer.msg('网络异常，请稍后重试', {icon: 2});
                    }
                });
            }
        })


        /*select change*/
        form.on('select(selctOnchange)', function (data) {
            // console.log(data.elem); //得到select原始DOM对象
            // console.log(data.elem.id); //得到select id 属性
            // console.log(data.elem.name); //得到select name 属性
            // console.log(data.value); //得到被选中的值
            // console.log(data.othis); //得到美化后的DOM对象
            if(data.value == 2){
                $(data.elem).parents('.layui-menu-item-group').find('.purchase_email').parents('.layui-col-md5').hide();
                $(data.elem).parents('.layui-menu-item-group').find('.new_orders_id').parents('.layui-col-md5').hide();
                $(data.elem).parents('.layui-menu-item-group').find('.total_amount').parents('.layui-col-md5').hide();
                // $(data.elem).parents('.layui-menu-item-group').find('.item_count').parents('.layui-col-md5').hide();
                $(data.elem).parents('.layui-menu-item-group').find('.arrival_date').parents('.layui-col-md5').hide();
                $(data.elem).parents('.layui-menu-item-group').find('.ship_code').parents('.layui-col-md5').hide();
                $(data.elem).parents('.layui-menu-item-group').find('.purchase_status').parents('.layui-col-md5').hide();
                $(data.elem).parents('.layui-menu-item-group').find('.wal_logistics').parents('.layui-col-md5').hide();
            }else{
                $(data.elem).parents('.layui-menu-item-group').find('.purchase_email').parents('.layui-col-md5').show();
                $(data.elem).parents('.layui-menu-item-group').find('.new_orders_id').parents('.layui-col-md5').show();
                $(data.elem).parents('.layui-menu-item-group').find('.total_amount').parents('.layui-col-md5').show();
                $(data.elem).parents('.layui-menu-item-group').find('.item_count').parents('.layui-col-md5').show();
                $(data.elem).parents('.layui-menu-item-group').find('.arrival_date').parents('.layui-col-md5').show();
                $(data.elem).parents('.layui-menu-item-group').find('.ship_code').parents('.layui-col-md5').show();
                $(data.elem).parents('.layui-menu-item-group').find('.purchase_status').parents('.layui-col-md5').show();
                $(data.elem).parents('.layui-menu-item-group').find('.wal_logistics').parents('.layui-col-md5').show();
            }
        })

        $("._submit").unbind("click");
        $('._submit').on('click',function () {
            var _this = $(this);
            var data_id = $('._form').attr('data_id');
            /*构建参数*/
            var data = {};
            data.interest = _this.parents('.layui-menu-item-group').find('.interest').val();
            data.purchase_email = _this.parents('.layui-menu-item-group').find('.purchase_email').val();
            data.new_orders_id = _this.parents('.layui-menu-item-group').find('.new_orders_id').val();
            data.total_amount = _this.parents('.layui-menu-item-group').find('.total_amount').val()?_this.parents('.layui-menu-item-group').find('.total_amount').val():0;
            data.item_count = _this.parents('.layui-menu-item-group').find('.item_count').val()?_this.parents('.layui-menu-item-group').find('.item_count').val():0;
            data.arrival_date = _this.parents('.layui-menu-item-group').find('.arrival_date').val();
            data.ship_code = _this.parents('.layui-menu-item-group').find('.ship_code').val();
            data.purchase_status = _this.parents('.layui-menu-item-group').find('.purchase_status').val();
            data.wal_logistics = _this.parents('.layui-menu-item-group').find('.wal_logistics').val();
            data.purchaser_remark = _this.parents('.layui-menu-item-group').find('.purchaser_remark').val();
            /*外采订单ID*/
            data.parent_id = data_id;
            /*子单ID*/
            data.children_id = _this.parents('.layui-menu-item-group').attr('data_id')?_this.parents('.layui-menu-item-group').attr('data_id'):0;
            // console.log(JSON.stringify(data));

            /*邮箱验证*/
            if(data.purchase_email && !/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(data.purchase_email)){
                layer.tips("邮箱格式不正确",_this.parents('.layui-menu-item-group').find('.purchase_email'),{time:2000,tips:2});
                return false;
            }
            /*金钱验证*/
            if(data.total_amount && !/^\d+(\.\d{1,2})?$/.test(data.total_amount)){
                layer.tips("金额格式不正确",_this.parents('.layui-menu-item-group').find('.total_amount'),{time:2000,tips:2});
                return false;
            }

            if(data.interest == 0){
                layer.msg('下单选择必填');
                return false;
            }
            if(data.interest == '1' && (data.purchase_email=='' || data.new_orders_id=='' || data.total_amount==0 || data.item_count==0 ) ){
                layer.msg('<下单> 必填采购邮箱、WAL订单号、实付金额、下单数量');
                return false;
            }

            if(data.interest == '2' && (data.purchaser_remark=='' || data.item_count=='')){
                layer.msg('<无法下单> 必填 数量 和 备注');
                return false;
            }
            // console.log(JSON.stringify(data));
            $.ajax({
                type: 'post',
                data:{
                    'act':'submitInfo',
                    'data': JSON.stringify(data),
                },
                url: "editeInfo",
                dataType: 'json',
                success: function (rst) {
                    console.log(rst);
                    if(rst.status>0){
                        if(!data.children_id || data.children_id == 0){
                            _this.parents('.layui-menu-item-group').attr('data_id',rst.data_id);
                        }
                        layer.msg(rst.info);
                    }else{
                        layer.msg(rst.info);
                    }

                }
            })


        })

        form.render();

    });

    $('._del').on('click',function () {
        var _this = $(this);
        var data = {};
        data.id = _this.parents('.layui-menu-item-group').attr('data_id');
        data.parent_id = $('._form').attr('data_id');
        if(data.id && data.id != ''){
            layer.alert('确定要删除吗？', {
                btn: ['确认删除'], //按钮
                icon:7,
                title:'重要提示！！！'
            }, function(){
                $.ajax({
                    type: 'post',
                    data:{
                        'data': JSON.stringify(data),
                    },
                    url: "delete",
                    dataType: 'json',
                    success: function (rst) {
                        if(rst.status>0){
                            _this.parents('.layui-quote-nm').remove();
                            checkList();
                            layer.msg(rst.info);
                        }else{
                            layer.msg(rst.info);
                        }
                    }
                })

            });
        }else{
            _this.parents('.layui-quote-nm').remove();
            checkList();
        }
    })
}

function checkList(){
    if($(".group_list").children().length<1){
        $('._add').click();
    }
}


$('body').on('mouseenter', '.img-avatar', function () {
    // 获取图片的src和alt属性
    var src = $(this).attr('src');
    var alt = $(this).attr('alt');

    // 创建一个新的img标签用于显示放大后的图片
    var $img = $('<img>').attr({
        src: src,
        alt: alt
    }).css({
        maxWidth: '100%',
        maxHeight: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 'auto',
        zIndex: 9999
    });

    // 创建一个新的layer弹窗，并将$img插入其中
    layer.open({
        type: 1,
        title: false,
        closeBtn: 0,
        shadeClose: true,
        area: ['auto', 'auto'],
        content: $img.prop('outerHTML'),
        success: function () {
            // 在弹窗关闭时，删除$img标签
            $('.layui-layer-close').click(function () {
                $img.remove();
            });
        }
    });
});
