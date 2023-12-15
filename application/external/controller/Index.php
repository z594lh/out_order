<?php
namespace app\external\controller;
use think\Controller;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use think\facade\Request;

class Index extends Controller
{

    // 首页
    public function index()
    {
        // 判断是否存在名为 username 的 Cookie
        if (cookie('?username')) {
            /*如果存在，则直接跳转到首页*/

            return $this->fetch('index');
        } else {
            /*如果不存在，则跳转到登录页面*/
            return $this->fetch('login');
        }
    }

    // 登录页面
    public function login()
    {
        // 判断是否存在名为 username 的 Cookie
        if (cookie('?username')) {
            /*如果存在，则直接跳转到首页*/

            return $this->fetch('index');
        } else {
            /*如果不存在，则跳转到登录页面*/
            return $this->fetch('login');
        }
    }


    public function doLogin(){
        $data = $this->request->param();
        $act = $data['act'];
        $param = json_decode($data['data'],true);

        /*请求登录接口*/
        $rst = postRequest($param,$act);
        if($rst['status']>0){
            $expires = 3*60*60; // 3小时过期
            cookie('username', $param['username'], ['expire' => $expires]);
        }
        return $rst;
    }

    public function logout(){
        cookie('username', null);
        return $this->fetch('login');
    }

    /*获取4.0外采订单数据*/
    public function getOrderList(){
        $param = $this->request->param();
        $dataList = postRequest($param,'getOrderList');

        foreach ($dataList['rows'] as $k => $v){
            $dataList['rows'][$k]['purchase_status'] = $v['purchase_status']!=''?IMG_HTTP.$v['purchase_status']:'';
            $dataList['rows'][$k]['wal_logistics'] = $v['wal_logistics']!=''?IMG_HTTP.$v['wal_logistics']:'';
        }
        $return['status'] = 200;
        $return['message'] = 'test';
        $return['total'] = $dataList['total'];
        $return['page'] = $param['page'];
        $return['limit'] = $param['limit'];
        $return['rows']['item'] = $dataList['rows'];
        return $return;
    }


    /*编辑录入页面*/
    public function edite()
    {
        $param = $this->request->param();
        $this->assign('img_http', IMG_HTTP);
        $this->assign('data_id', isset($param['data_id'])?$param['data_id']:0);
        return view();
    }

    public function getInfoForId(){
        $param = $this->request->param();
        $info = postRequest($param,'getInfoForId');
        return $info;
    }

    /*编辑数据*/
    public function editeInfo(){
        $data = $this->request->param();
        $act = $data['act'];
        $param = json_decode($data['data'],true);
        unset($param['file']);
        $param['order_date'] = date('Y-m-d H:i:s',time());
        /*post*/
        $rst = postRequest($param,$act);
        return $rst;
    }

    /*删除子单*/
    public function delete(){
        $data = $this->request->param();
        $param = json_decode($data['data'],true);
        /*post*/
        $rst = postRequest($param,'delete');
        return $rst;
    }

    /**
     * @throws \PhpOffice\PhpSpreadsheet\Exception
     * @throws \PhpOffice\PhpSpreadsheet\Writer\Exception
     * 导出数据
     */
    public function export()
    {
        $param = $this->request->param();
        $orderlist = postRequest($param,'exportData');
        $dataList = $orderlist['rows'];
        /*需要导出的数据*/
        $data = array();
        foreach ($dataList as $k => $v){
            $_row['purchase_email'] = $v['purchase_email'];
            $_row['new_orders_id'] = $v['new_orders_id'];
            $_row['total_amount'] = $v['total_amount'];
            $_row['item_count'] = $v['item_count'];
            $_row['order_date'] = $v['order_date'];
            $_row['buyer_id'] = $v['buyer_id'];
            $_row['purchase_link'] = $v['purchase_link'];
            $_row['interest'] = $v['interest'] == 1?'下单':'无法下单';
            $data[] = $_row;
        }


        $spreadsheet = new Spreadsheet();

        // 设置表头
        $spreadsheet->setActiveSheetIndex(0)
            ->setCellValue('A1', '采购邮箱')
            ->setCellValue('B1', 'WAL订单号')
            ->setCellValue('C1', '实付金额')
            ->setCellValue('D1', '数量')
            ->setCellValue('E1', '下单日期')
            ->setCellValue('F1', '订单号')
            ->setCellValue('G1', 'WAL链接')
            ->setCellValue('H1', '是否下单');

        // 循环填充数据
        $row = 2;
        foreach ($data as $item) {

            // 设置单元格格式
            $spreadsheet->getActiveSheet()->getStyle('B' . $row)->getNumberFormat()->setFormatCode(\PhpOffice\PhpSpreadsheet\Style\NumberFormat::FORMAT_NUMBER);
            $spreadsheet->getActiveSheet()->getStyle('F' . $row)->getNumberFormat()->setFormatCode(\PhpOffice\PhpSpreadsheet\Style\NumberFormat::FORMAT_NUMBER);
            $spreadsheet->getActiveSheet()
                ->setCellValue('A' . $row, $item['purchase_email'])
                ->setCellValue('B' . $row, $item['new_orders_id'])
                ->setCellValue('C' . $row, $item['total_amount'])
                ->setCellValue('D' . $row, $item['item_count'])
                ->setCellValue('E' . $row, $item['order_date'])
                ->setCellValue('F' . $row, $item['buyer_id'])
                ->setCellValue('G' . $row, $item['purchase_link'])
                ->setCellValue('H' . $row, $item['interest']);
            $row++;
        }

        // 设置文件名和格式
        $filename = date('Ymdhis').'.xlsx';

        // 创建 Excel 文件写入器
        $writer = new Xlsx($spreadsheet);

        // 将文件保存到指定目录
        $writer->save($filename);

        // 下载 Excel 文件
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename="' . $filename . '"');
        header('Cache-Control: max-age=0');
        $writer->save('php://output');
    }

}
