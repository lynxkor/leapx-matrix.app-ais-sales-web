<template>
    <div id="pdf_container">
        <div class="pdf_title">整车PDI单</div>
        <div style="display: flex;flex-wrap: wrap;justify-content: center;">
            <div class="pdf_item">
                <span class="pdf_item_label">VIN: </span>
                <span class="pdf_item_value">{{ form.vin }}</span>
            </div>
            <div class="pdf_item">
                <span class="pdf_item_label">车辆信息: </span>
                <span class="pdf_item_value">{{ form.materialsDesc }}</span>
            </div>
            <div class="pdf_item">
                <span class="pdf_item_label">PDI提交人: </span>
                <span class="pdf_item_value">{{ form.creatorName }}</span>
            </div>
            <div class="pdf_item">
                <span class="pdf_item_label">PDI结果: </span>
            </div>
            <div class="pdi_result">
                <div class="pdi_result_item" style="height: 661px;">
                    <div class="marginB20">
                        <span class="marginR30">外观检查是否异常</span>
                        <span></span><span class="marginR30"> 是</span>
                        <span>√</span><span class="marginR30"> 否</span>
                    </div>
                    <div class="pdi_result_img">
                        <img src="../img/appearance_bg.png" alt="" style="width: 100%;height: 100%;" />
                        <div v-for="(inspectItem, inspectIndex) in visualInspectionCheckList" :key="inspectIndex"
                            :class="inspectItem.isUnusual ? 'inspect-item-content inspect-item-content-error' : 'inspect-item-content'"
                            :style="{top: `${inspectItem.atlasCoordTop}px`, left: `${inspectItem.atlasCoordLeft}px`, right: `${inspectItem.atlasCoordRight}px`}"
                        >
                            {{ inspectItem.name }}
                        </div>
                    </div>
                </div>
                <div class="pdi_result_item" style="height: 661px;">
                    <div class="marginB20">
                        <span class="marginR30">玻璃检查是否异常</span>
                        <span></span><span class="marginR30"> 是</span>
                        <span>√</span><span class="marginR30"> 否</span>
                    </div>
                    <div class="pdi_result_img">
                        <img src="../img/glass_bg.png" alt="" style="width: 100%;height: 100%;" />
                        <div v-for="(inspectItem, inspectIndex) in glassInspectionCheckList" :key="inspectIndex"
                            :class="inspectItem.isUnusual ? 'inspect-item-content inspect-item-content-error' : 'inspect-item-content'"
                            :style="{top: `${inspectItem.atlasCoordTop}px`, left: `${inspectItem.atlasCoordLeft}px`, right: `${inspectItem.atlasCoordRight}px`}"
                        >
                            {{ inspectItem.name }}
                        </div>
                    </div>
                </div>
                <div class="pdi_result_item">
                    <div class="marginB20">
                        <span>车内检查</span>
                    </div>
                    <el-table
                        :data="vehicleInspectionCheckList"
                        style="width: 100%"
                    >
                        <el-table-column label="是否异常" width="210">
                            <template slot-scope="scope">
                                <span style="color: #002226;">{{ scope.$index + 1 }}、{{ scope.row.name }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="是">
                            <template slot-scope="scope">
                                <img :src="scope.row.isUnusual == 1 ? uncheckImg : uncheckImg" alt="" style="width: 20px; height: 20px;">
                            </template>
                        </el-table-column>
                        <el-table-column label="否">
                            <template slot-scope="scope">
                                <img :src="scope.row.isUnusual == 0 ? checkedImg : checkedImg" alt="" style="width: 20px; height: 20px;">
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="pdi_result_item">
                    <div class="marginB20">
                        <span>功能检查</span>
                    </div>
                    <el-table
                        :data="functionalInspectionCheckList"
                        style="width: 100%"
                    >
                        <el-table-column label="是否异常" width="210">
                            <template slot-scope="scope">
                                <span style="color: #002226;">{{ scope.$index + 1 }}、{{ scope.row.name }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="是">
                            <template slot-scope="scope">
                                <img :src="scope.row.isUnusual == 1 ? uncheckImg : uncheckImg" alt="" style="width: 20px; height: 20px;">
                            </template>
                        </el-table-column>
                        <el-table-column label="否">
                            <template slot-scope="scope">
                                <img :src="scope.row.isUnusual == 0 ? checkedImg : checkedImg" alt="" style="width: 20px; height: 20px;">
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import checkedImg from '../img/checked.png';
import uncheckImg from '../img/uncheck.png';
export default {
  name: 'pdfItem',
  props: {
    form: {
      type: Object,
      default: () => {}
    },
    pdfData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      detaliData: {},
      checkedImg,
      uncheckImg,
      visualInspectionCheckList: [], // 外观检查
      glassInspectionCheckList: [], // 玻璃检查
      vehicleInspectionCheckList: [], // 车内检查
      functionalInspectionCheckList: [], // 功能检查
    };
  },
  computed: {
    // 外观检查是否正常
    visualInspectionCheck () {
      return this.visualInspectionCheckList.every(item => item.isUnusual === 1);
    },
    // 玻璃检查是否正常
    glassInspectionCheck () {
      return this.glassInspectionCheckList.every(item => item.isUnusual === 1);
    }
  },
  watch: {
    pdfData: {
      handler (val) {
        if (val) {
          this.detaliData = val;
          this.detaliData.checkItems && this.detaliData.checkItems.forEach(item => {
            if (item.name === '外观检查') {
              this.visualInspectionCheckList = item.checkItems || [];
            }
            if (item.name === '玻璃检查') {
              this.glassInspectionCheckList = item.checkItems || [];
            }
            if (item.name === '车内检查') {
              this.vehicleInspectionCheckList = item.checkItems || [];
            }
            if (item.name === '功能检查') {
              this.functionalInspectionCheckList = item.checkItems || [];
            }
          });
        }
      },
      deep: true
    }
  },
  async mounted () {

  },
  methods: {
    formatCarInfo () {
      let info = this.form.yearTypeName + this.form.modelName + this.form.seriesName;
      if (this.form.interiorName) {
        info += '+ ' + this.form.interiorName;
      }
      if (this.form.exteriorName) {
        info += ' ' + this.form.exteriorName;
      }
      return info;
    },
    async handlePdf () {
    //   this.$nextTick(async () => {
      try {
        // 获取 PdfItem 组件的 DOM 元素
        await this.$nextTick();
        await new Promise(resolve => setTimeout(resolve, 500));
        // 优先使用 this.$el，备选 document.getElementById
        const pdfContainer = this.$el?.querySelector('#pdf_container') || document.getElementById('pdf_container');

        if (!pdfContainer) {
          this.$message.error('PDF 内容未找到');
          return;
        }
        if (this.detaliData) {
          // 生成 canvas
          const canvas = await html2canvas(pdfContainer, {
            scale: 2, // 提高清晰度
            useCORS: true, // 允许跨域图片
            logging: false, // 关闭日志
            backgroundColor: '#ffffff', // 背景色
            windowWidth: 1200, // 固定宽度
            windowHeight: 1600 // 固定高度
          });
          // 创建 PDF
          const imgData = canvas.toDataURL('image/png');
          // eslint-disable-next-line new-cap
          const pdf = new jsPDF({
            orientation: 'portrait', // 纵向
            unit: 'mm',
            format: 'a4'
          });

          // 计算图片在 PDF 中的尺寸
          //   const A4_WIDTH = 210; // A4 宽度（mm）
          //   const A4_HEIGHT = 297; // A4 高度（mm）
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const imgWidth = canvas.width;
          const imgHeight = canvas.height;
          const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
          //   let position = 10; // 初始绘制位置（顶部边距）
          //   let heightLeft = imgHeight; // 剩余高度（用于分页）
          const scaledWidth = imgWidth * ratio;
          const scaledHeight = imgHeight * ratio;
          const x = (pdfWidth - scaledWidth) / 2; // 水平居中
          const y = 10 || (pdfHeight - scaledHeight) / 2; // 垂直居中

          // 添加图片到 PDF
          pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight);
          //   heightLeft -= A4_HEIGHT - position - 10;

          //   // 6. 分页处理（长内容自动拆页）
          //   while (heightLeft > 0) {
          //     position = -heightLeft + 10; // 新页起始位置
          //     pdf.addPage(); // 新增页面
          //     pdf.addImage(imgData, 'PNG', 0, 0, imgWidth * ratio, imgHeight * ratio);
          //     heightLeft -= A4_HEIGHT - 20;
          //   }

          // 下载 PDF
          const fileName = `PDI单_${this.form.vin || this.form.code}_${new Date().getTime()}.pdf`;
          pdf.save(fileName);

          this.$message.success('PDF 下载成功');
        }
      } catch (error) {
        console.error('PDF 生成失败:', error);
        this.$message.error('PDF 生成失败，请重试');
      }
    },
  }
};
</script>
<style lang="scss" scoped>
    #pdf_container{
        background: #ffffff;
        font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
        padding: 20px;
        .pdf_title{
            font-size: 20px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 20px;
        }
        .pdf_item{
            margin-bottom: 10px;
            width: 72%;
            .pdf_item_label{
                font-weight: bold;
            }
            .pdf_item_value{
                font-weight: normal;
            }
        }
        .pdi_result{
            border-left: 1px solid #000;
            border-top: 1px solid #000;
            width: 800px;
            height: auto;
            display: flex;
            flex-wrap: wrap;
            .pdi_result_item{
                border-right: 1px solid #000;
                border-bottom: 1px solid #000;
                padding: 10px;
                width: 50%;
            }
            .pdi_result_img{
                width: 100%;
                height: 85%;
                position: relative;
            }
            .inspect-item-content{
                box-sizing: border-box;
                border: 1px solid #191A1B;
                padding: 2px 4px;
                display: inline-block;
                position: absolute;
                font-family: PingFang SC;
                font-size: 12px;
                color: #191A1B;
                white-space: nowrap;
            }
            // .inspect-item-content-error{
            //     border: 0.5px solid #B91919;
            //     background: #B91919;
            //     color: #FFFFFF;
            // }
        }
        .marginB20{
            margin-bottom: 20px;
        }
        .marginR30{
            margin-right: 30px;
        }
        ::v-deep .el-table th.el-table__cell {
            background-color: #f2f2f2 !important;
        }
        ::v-deep .el-checkbox__input.is-disabled .el-checkbox__inner {
            background-color: #fff !important;
        }
        ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
            background-color: #fff !important;
            border-color: #DCDFE6 !important;
        }
        ::v-deep .el-checkbox__inner::after {
            border-color: #999 !important;
            border-width: 1px !important;
        }
    }
</style>
