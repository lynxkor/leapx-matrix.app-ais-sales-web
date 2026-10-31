<template>
  <edit-page-layout ref="editLayout" title="车辆排查任务" showPaneFooter>
    <template #left>
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="title"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
        :dataTransform="transformDetail"
      >
        <template #status>
          <span :class="['status', form.taskStatus === 110 ? 'danger' : 'primary']">{{ form.taskStatusLabel }}</span>
        </template>
        <template #extraButtons>
          <el-button v-if="canPublish" type="warning" :loading="publishLoading" @click="handlePublish">发布任务</el-button>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- 编辑模式 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm1" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="任务编码：" prop="checkTaskCode">
                  <el-input
                    placeholder="系统自动创建"
                    v-model="form.checkTaskCode"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="任务名称：" prop="taskName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.taskName"
                    clearable
                    maxlength="50"
                  />
                </el-form-item>
                <el-form-item label="系统版本号：" prop="vehicleSystemVersion" v-if="showSystemVersion">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleSystemVersion"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="排查原因：" prop="checkReason">
                  <el-input
                    type="textarea"
                    placeholder="请输入"
                    v-model="form.checkReason"
                    clearable
                    maxlength="200"
                    show-word-limit
                  />
                </el-form-item>
                <el-form-item label="排查方法：" prop="checkMethod">
                  <el-input
                    type="textarea"
                    placeholder="请输入"
                    v-model="form.checkMethod"
                    clearable
                    maxlength="500"
                    show-word-limit
                  />
                </el-form-item>
              </el-form>
              <!-- 详情模式 -->
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="任务编码：">{{ form.checkTaskCode }}</el-form-item>
                <el-form-item label="任务名称：">{{ form.taskName }}</el-form-item>
                <el-form-item label="任务状态：">{{ form.taskStatusLabel }}</el-form-item>
                <el-form-item label="系统版本号：">{{ form.vehicleSystemVersion }}</el-form-item>
                <el-form-item label="排查原因：">{{ form.checkReason }}</el-form-item>
                <el-form-item label="排查方法：">{{ form.checkMethod }}</el-form-item>
                <el-form-item label="车辆数量：">{{ form.totalVehicleCount }}</el-form-item>
                <el-form-item label="完成数量：">{{ form.finishedVehicleCount }}</el-form-item>
                <el-form-item label="剩余数量：">{{ form.remainVehicleCount }}</el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>任务设置</h2>
            </div>
            <div class="common-section-body">
              <!-- 编辑模式 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm2" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="是否锁车：" prop="lockVehicleFlag">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vs_risk_check_lock_flag"
                    v-model="form.lockVehicleFlag"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="审核方式：" prop="auditType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vs_risk_check_audit_type"
                    v-model="form.auditType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="任务要求：" prop="taskRequirement">
                  <el-input
                    type="textarea"
                    placeholder="请输入"
                    v-model="form.taskRequirement"
                    clearable
                    maxlength="500"
                    show-word-limit
                  />
                </el-form-item>
              </el-form>
              <!-- 详情模式 -->
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="是否锁车：">{{ form.lockVehicleFlagLabel }}</el-form-item>
                <el-form-item label="审核方式：">{{ form.auditTypeLabel }}</el-form-item>
                <el-form-item label="任务要求：">{{ form.taskRequirement }}</el-form-item>
              </el-form>
            </div>
          </section>
          <!-- 推送配置（多行表格，每行 4 项必填，后端 G22 拦截） -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>推送配置</h2>
            </div>
            <div class="common-section-body">
              <!-- 编辑模式：表格多行编辑，可删除任意行（🔑 发布后=进行中，推送配置锁定为只读，仅草稿态可编辑） -->
              <div v-show="(isEditing || !_id) && isDraft">
                <el-form :model="form" :rules="rules" ref="ruleForm3">
                  <el-table :data="form.pushConfigList" border size="small" class="push-config-table">
                    <el-table-column label="序号" type="index" width="64" align="center" />
                    <el-table-column label="车辆状态范围" min-width="200">
                      <template slot-scope="scope">
                        <el-form-item
                          label-width="0"
                          :prop="'pushConfigList.' + scope.$index + '.vehicleStatusList'"
                          :rules="pushConfigRules.vehicleStatusList"
                        >
                          <fetch-select
                            class="push-config-select"
                            :options="vehicleStatusOptions"
                            labelKey="label"
                            valueKey="value"
                            v-model="scope.row.vehicleStatusList"
                            placeholder="请选择车辆状态"
                            clearable
                            filterable
                            multiple
                            :collapse-tags="false"
                            wrap-tags
                          />
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column label="车辆类型范围" min-width="170">
                      <template slot-scope="scope">
                        <el-form-item
                          label-width="0"
                          :prop="'pushConfigList.' + scope.$index + '.vehicleCategoryList'"
                          :rules="pushConfigRules.vehicleCategoryList"
                        >
                          <fetch-select
                            class="push-config-select"
                            :options="vehicleCategoryOptions"
                            labelKey="label"
                            valueKey="value"
                            v-model="scope.row.vehicleCategoryList"
                            placeholder="请选择车辆类型"
                            clearable
                            filterable
                            multiple
                            :collapse-tags="false"
                            wrap-tags
                          />
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column label="门店分类" min-width="140">
                      <template slot-scope="scope">
                        <el-form-item
                          label-width="0"
                          :prop="'pushConfigList.' + scope.$index + '.storeCategory'"
                          :rules="pushConfigRules.storeCategory"
                        >
                          <fetch-select
                            class="push-config-select"
                            :request="fetchOptions"
                            enumCode="vs_risk_check_store_category"
                            v-model="scope.row.storeCategory"
                            placeholder="请选择门店分类"
                            clearable
                            filterable
                          />
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column label="推送对象" min-width="200">
                      <template slot-scope="scope">
                        <el-form-item
                          label-width="0"
                          :prop="'pushConfigList.' + scope.$index + '.pushUserRoleList'"
                          :rules="pushConfigRules.pushUserRoleList"
                        >
                          <fetch-select
                            class="push-config-select"
                            :options="pushUserRoleOptions"
                            labelKey="label"
                            valueKey="value"
                            v-model="scope.row.pushUserRoleList"
                            placeholder="请选择推送对象"
                            clearable
                            filterable
                            multiple
                            :collapse-tags="false"
                            wrap-tags
                          />
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="88" align="center">
                      <template slot-scope="scope">
                        <el-button type="text" class="push-config-remove" @click="removePushConfigRow(scope.$index)">删除</el-button>
                      </template>
                    </el-table-column>
                    <template slot="empty">
                      <span class="push-config-empty">暂无推送配置，请点击下方「新增配置」添加</span>
                    </template>
                  </el-table>
                </el-form>
                <div class="push-config-footer">
                  <el-button type="primary" plain size="small" icon="el-icon-plus" @click="addPushConfigRow">新增配置</el-button>
                  <span class="push-config-tip">每行一条独立规则：车辆「状态 + 类型」同时命中才推送；可删除任意行，仅保存表格中最终剩余的配置</span>
                </div>
              </div>
              <!-- 详情模式：只读表格 -->
              <el-table
                :data="form.pushConfigList"
                border
                size="small"
                class="push-config-table"
                v-show="!(isEditing || !_id) || !isDraft"
              >
                <el-table-column label="序号" type="index" width="64" align="center" />
                <el-table-column label="车辆状态范围" min-width="200">
                  <template slot-scope="scope">{{ statusText(scope.row.vehicleStatusList) }}</template>
                </el-table-column>
                <el-table-column label="车辆类型范围" min-width="170">
                  <template slot-scope="scope">{{ categoryText(scope.row.vehicleCategoryList) }}</template>
                </el-table-column>
                <el-table-column label="门店分类" min-width="140">
                  <template slot-scope="scope">{{ storeCategoryText(scope.row.storeCategory) }}</template>
                </el-table-column>
                <el-table-column label="推送对象" min-width="200">
                  <template slot-scope="scope">{{ pushUserRoleText(scope.row.pushUserRoleList) }}</template>
                </el-table-column>
              </el-table>
            </div>
          </section>
          <!-- 排查方法附件 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>排查方法附件</h2>
            </div>
            <div class="common-section-body">
              <!-- 🔑 两步交互（参考 vehretail soldPlateInfo/edit 实名认证信息附件上传）：
                   附件按 businessId（任务ID）关联单据，新建时还没有任务ID无法上传，
                   所以第 1 步先「保存」创建任务拿到ID，第 2 步进入编辑态才能上传附件。 -->
              <!-- 🔑 车辆排查任务不做「附件类型配置」：显式传 uploadConfig 后，
                   组件内部判断 `configCode && !uploadConfig` 不成立，跳过
                   attachmentConfig/getByCodeWithBusinessData，仅保留前端上传规则；
                   configCode 仍保留，用于上传时随 addOrUpdate 关联业务单据 -->
              <AisAttachment
                :businessId="_id"
                configCode="vehicle_risk_check_task"
                :uploadConfig="attachmentUploadConfig"
                attachType="其他"
                :readonly="!_id || !isEditing"
              />
            </div>
          </section>
          <!-- 排查车辆清单（T10：分页查询当前排查任务的明细，PRD 多维筛选） -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>排查车辆清单</h2>
            </div>
            <div class="common-section-body">
              <!-- 筛选区：VIN/门店名称走 TagInput 批量文本；类型/状态走枚举多选；车系等走主数据远程多选 -->
              <el-form :inline="true" :model="detailForm" label-width="150px" class="form-edit detail-search-form">
                <el-form-item label="VIN：">
                  <tag-input v-model="detailForm.vinList" placeholder="支持批量，回车分隔" style="margin-top:4px" />
                </el-form-item>
                <el-form-item label="车辆类型：">
                  <fetch-select
                    :options="vehicleCategoryOptions"
                    labelKey="label"
                    valueKey="value"
                    v-model="detailForm.vehicleTypeList"
                    placeholder="请选择"
                    clearable
                    multiple
                    collapse-tags
                    filterable
                  />
                </el-form-item>
                <el-form-item label="车系名称：">
                  <fetch-select
                    :remote-method="seriesSearch"
                    remote
                    :options="seriesList"
                    v-model="detailForm.seriesIdList"
                    placeholder="请选择"
                    labelKey="name"
                    valueKey="id"
                    clearable
                    multiple
                    collapse-tags
                    filterable
                  />
                </el-form-item>
                <el-form-item label="车型名称：">
                  <fetch-select
                    :remote-method="modelSearch"
                    remote
                    :options="modelList"
                    v-model="detailForm.modelIdList"
                    placeholder="请选择"
                    labelKey="name"
                    valueKey="id"
                    clearable
                    multiple
                    collapse-tags
                    filterable
                  />
                </el-form-item>
                <el-form-item label="年款：">
                  <fetch-select
                    :remote-method="yearTypeSearch"
                    remote
                    :options="yearTypeList"
                    v-model="detailForm.yearTypeIdList"
                    placeholder="请选择"
                    labelKey="name"
                    valueKey="id"
                    clearable
                    multiple
                    collapse-tags
                    filterable
                  />
                </el-form-item>
                <el-form-item label="外观名称：">
                  <fetch-select
                    :remote-method="exteriorSearch"
                    remote
                    :options="exteriorList"
                    v-model="detailForm.exteriorIdList"
                    placeholder="请选择"
                    labelKey="name"
                    valueKey="id"
                    clearable
                    multiple
                    collapse-tags
                    filterable
                  />
                </el-form-item>
                <el-form-item label="内饰名称：">
                  <fetch-select
                    :remote-method="interiorSearch"
                    remote
                    :options="interiorList"
                    v-model="detailForm.interiorIdList"
                    placeholder="请选择"
                    labelKey="name"
                    valueKey="id"
                    clearable
                    multiple
                    collapse-tags
                    filterable
                  />
                </el-form-item>
                <el-form-item label="销售门店（名称）：">
                  <tag-input v-model="detailForm.saleDealerNameList" placeholder="支持批量，回车分隔" style="margin-top:4px" />
                </el-form-item>
                <el-form-item label="交付门店（名称）：">
                  <tag-input v-model="detailForm.deliveryDealerNameList" placeholder="支持批量，回车分隔" style="margin-top:4px" />
                </el-form-item>
                <el-form-item label="车辆状态：">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vehstock_vechicle_status"
                    v-model="detailForm.vehicleStatusList"
                    placeholder="请选择"
                    clearable
                    multiple
                    collapse-tags
                    filterable
                  />
                </el-form-item>
                <el-form-item label="锁定状态：">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vs_risk_check_lock_status"
                    v-model="detailForm.lockStatusList"
                    placeholder="请选择"
                    clearable
                    multiple
                    collapse-tags
                    filterable
                  />
                </el-form-item>
                <el-form-item label="排检状态：">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="vs_risk_check_status"
                    v-model="detailForm.checkStatusList"
                    placeholder="请选择"
                    clearable
                    multiple
                    collapse-tags
                    filterable
                  />
                </el-form-item>
                <el-form-item label="" class="form-item-btns">
                  <el-button size="small" type="primary" plain @click="handleDetailQuery">查询</el-button>
                  <el-button size="small" @click="handleDetailReset" style="margin-left:8px">重置</el-button>
                </el-form-item>
              </el-form>

              <!-- 操作区 -->
              <div class="ais-actions detail-actions">
                <el-button size="small" type="primary" plain :disabled="!canOperateVehicle || detailSelection.length === 0" @click="handleCancelCheck">取消排查</el-button>
                <el-button size="small" type="primary" plain :disabled="!canOperateVehicle || detailSelection.length === 0" @click="handleUnlockVehicle">车辆解锁</el-button>
                <el-button size="small" type="primary" plain :disabled="!canOperateVehicle" @click="handleAddVehicle">新增车辆</el-button>
                <el-button size="small" type="primary" plain :disabled="!canOperateVehicle" @click="openImport">导入</el-button>
                <el-button size="small" @click="handleOneClickRemind">一键提醒</el-button>
              </div>

              <!-- 表格 -->
              <el-table
                ref="detailTable"
                :data="detailTableData"
                v-loading="detailLoading"
                border
                size="small"
                @selection-change="handleDetailSelectionChange"
              >
                <el-table-column type="selection" width="48" align="center" />
                <el-table-column prop="vin" label="VIN" min-width="180" />
                <el-table-column prop="saleDealerName" label="销售门店" min-width="160" show-overflow-tooltip />
                <el-table-column prop="deliveryDealerName" label="交付门店" min-width="160" show-overflow-tooltip />
                <el-table-column prop="vehicleTypeLabel" label="车辆类型" min-width="100" />
                <el-table-column prop="seriesName" label="车系名称" min-width="120" show-overflow-tooltip />
                <el-table-column prop="modelName" label="车型名称" min-width="120" show-overflow-tooltip />
                <el-table-column prop="yearTypeName" label="年款" min-width="100" />
                <el-table-column prop="exteriorName" label="外观名称" min-width="120" show-overflow-tooltip />
                <el-table-column prop="interiorName" label="内饰名称" min-width="120" show-overflow-tooltip />
                <el-table-column label="车辆状态" min-width="120">
                  <template slot-scope="scope">{{ formatVehicleStatus(scope.row.vehicleStatus) }}</template>
                </el-table-column>
                <el-table-column prop="checkStatusLabel" label="排检状态" min-width="100" />
                <el-table-column prop="lockStatusLabel" label="锁定状态" min-width="100" />
                <el-table-column prop="checkTime" label="排检时间" min-width="170" />
              </el-table>

              <!-- 分页 -->
              <div class="detail-pagination">
                <el-pagination
                  @size-change="handleDetailSizeChange"
                  @current-change="handleDetailCurrentChange"
                  :current-page="detailPageNum"
                  :page-sizes="[10, 20, 50, 100]"
                  :page-size="detailPageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="detailTotal"
                />
              </div>
            </div>
          </section>

          <!-- 新增车辆：批量 VIN 录入（同筛选区 TagInput，支持回车分隔） -->
          <el-dialog title="新增车辆" :visible.sync="addVehicleDialogVisible" width="560px" @close="addVinList = []">
            <el-form label-width="90px">
              <el-form-item label="车辆VIN：">
                <tag-input v-model="addVinList" placeholder="支持批量，回车分隔，每行一个VIN" style="width:100%" />
              </el-form-item>
              <div class="add-vehicle-tip">仅「进行中」任务可新增车辆；单次最多 200 条，重复或已存在的 VIN 由后端跳过</div>
            </el-form>
            <div slot="footer">
              <el-button @click="addVehicleDialogVisible = false">取消</el-button>
              <el-button type="primary" :loading="addVehicleLoading" @click="confirmAddVehicle">确定</el-button>
            </div>
          </el-dialog>

          <!-- Excel 导入车辆明细：复用通用导入引擎，按模板 code 服务端路由到后端 importVehicle -->
          <Upload
            :visible="importVisible"
            id="riskCheckTaskVehicleImport"
            :businessParams="_id"
            @getData="queryDetailList"
            @close="importVisible = false"
          />
        </el-main>
      </edit-base-container>
    </template>
    <template #right>
      <div class="page-common-edit">
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate, update, getAuthorityList, publishTask, addVehicle } from '@/api/vehstock/risktask/riskCheckTask/index';
import { getDetailList, cancelCheck, unlockVehicle, oneClickRemind } from '@/api/vehstock/risktask/riskCheckTaskDetail/index';
import FetchSelect from '@/libs/components/FetchSelect';
import TagInput from '@/libs/components/TagInput';
import { getEnum, vehicleSeriesList, vehicleModelList, listVehicleYearType, vehicleExterior, vehicleInterior } from '@/api/common';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import AisAttachment from '@/libs/components/AisAttachment/index.vue';
import Upload from '@/libs/components/UploadDialog';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

/**
 * 车辆状态选项：复用现网字典 vehstock_vechicle_status，但只允许选排查范围内的 5 个
 * 🔑 字典 key 错拼 `vechicle` 照抄，不修正
 */
const VEHICLE_STATUS_OPTIONS = [
  { value: '11', label: '在途' },
  { value: '20', label: '待提交PDI' },
  { value: '25', label: 'PDI待修复' },
  { value: '12', label: '已入门店库' },
  { value: '16', label: '调拨在途' }
];

// 🔑 车辆状态为台账码值（无 DictEnumType 自动出 Label），前端用此 map 兜底中文
const VEHICLE_STATUS_MAP = (() => {
  const m = {};
  VEHICLE_STATUS_OPTIONS.forEach(o => { m[o.value] = o.label; });
  return m;
})();

/**
 * 推送对象（用户角色）改为动态查询：
 * 🔑 调 /passport/authorityInfo/page 拉全量角色，value=authorityCode（落库存编码）、label=authorityName（展示名称）
 *    见 data.authorityOptions + computed.pushUserRoleOptions，参照 salesConfig 门店查询配置实现
 */

/**
 * 车辆类型选项：与后端 ReservationStatusEnum 1:1（1商品车 3展车 10试驾车），字典 vs_vehicle_category
 * 🔑 用静态 options 而非 enumCode，保证与后端 Integer 码值回显时类型一致（多选 el-select 严格相等匹配）
 */
const VEHICLE_CATEGORY_OPTIONS = [
  { value: '1', label: '商品车' },
  { value: '3', label: '展车' },
  { value: '10', label: '试驾车' }
];

const VEHICLE_CATEGORY_LABEL = {
  1: '商品车',
  3: '展车',
  10: '试驾车'
};

/**
 * 门店分类中文映射（后端 RiskCheckStoreCategoryEnum）
 * 🔑 行级配置没有回填 Optional 字段，中文只能前端映射
 */
const STORE_CATEGORY_LABEL = {
  10: '销售门店',
  60: '交付门店'
};

/**
 * 附件上传规则（纯前端，不走后端「附件类型配置」）
 * 🔑 车辆排查任务不需要特定附件配置，故显式传 uploadConfig 让 AisAttachment 跳过
 *    attachmentConfig/getByCodeWithBusinessData 请求；
 *    取值与 AisAttachment 内置默认保持一致（组件会用该对象整体替换内置配置，
 *    缺字段会导致最大体积/后缀校验失效，改这里要同步组件默认值）
 */
const ATTACHMENT_UPLOAD_CONFIG = {
  acceptSuffix: '.png,.jpg,.jpeg,.gif,.pdf,.ppt,.pptx,.xlsx,.xls,.docx,.doc,.rar,.zip,.mp4',
  maxSize: 50, // 50M
  maxNum: 0, // 0 不限制
  required: '0',
  needOcr: '0'
};

/**
 * 单行推送配置工厂
 * 🔑 必须是工厂函数：defaultForm 会被浅拷贝复用，直接写数组字面量会多实例共享引用
 */
const createPushConfigRow = () => ({
  vehicleStatusList: [],
  vehicleCategoryList: [],
  storeCategory: '',
  pushUserRoleList: []
});

/**
 * 行级校验规则（表格内 el-form-item 用 :rules 单独挂载）
 */
const PUSH_CONFIG_RULES = {
  vehicleStatusList: [
    { required: true, type: 'array', min: 1, message: '请选择车辆状态范围', trigger: 'change' }
  ],
  vehicleCategoryList: [
    { required: true, type: 'array', min: 1, message: '请选择车辆类型范围', trigger: 'change' }
  ],
  storeCategory: [
    { required: true, message: '请选择门店分类', trigger: 'change' }
  ],
  pushUserRoleList: [
    { required: true, type: 'array', min: 1, message: '请选择推送对象', trigger: 'change' }
  ]
};

const defaultForm = {
  id: '',
  checkTaskCode: '',
  taskName: '',
  taskStatus: 10,
  taskStatusLabel: '',
  checkReason: '',
  checkMethod: '',
  taskRequirement: '',
  vehicleSystemVersion: '',
  lockVehicleFlag: '',
  lockVehicleFlagLabel: '',
  auditType: '',
  auditTypeLabel: '',
  // 推送配置（多行表格，每行 4 字段必填，后端 G22 拦截）
  pushConfigList: [],
  totalVehicleCount: 0,
  finishedVehicleCount: 0,
  remainVehicleCount: 0
};

export default {
  name: 'riskCheckTaskEdit',
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '车辆排查任务：' + (this.form.checkTaskCode || '');
    },
    // 🔑 仅自动审核(60)时展示并必填系统版本号（后端 G21）
    showSystemVersion () {
      return Number(this.form.auditType) === 60;
    },
    vehicleStatusOptions () {
      return VEHICLE_STATUS_OPTIONS;
    },
    vehicleCategoryOptions () {
      return VEHICLE_CATEGORY_OPTIONS;
    },
    pushUserRoleOptions () {
      // 🔑 动态角色：value=编码（落库）、label=名称（展示），对齐 salesConfig 门店查询配置
      return this.authorityOptions.map(o => ({
        value: o.authorityCode,
        label: o.authorityName
      }));
    },
    pushConfigRules () {
      return PUSH_CONFIG_RULES;
    },
    // 🔑 草稿态（status=10）：仅草稿可编辑推送配置（推送配置区编辑门控，独立于按钮可见性）
    isDraft () {
      return Number(this.form.taskStatus) === 10;
    },
    // 🔑 后端按任务状态算出的按钮可见性（get 接口填充）；缺省 {} 避免空指针
    buttonControl () {
      return (this.form && this.form.buttonControl) || {};
    },
    // 🔑 发布按钮：后端 buttonControl.publishButton（仅草稿可发布）+ 发布权限
    canPublish () {
      return !!this._id && !!this.buttonControl.publishButton &&
        this.permissions.has(this.moduleKey + '-publish');
    },
    // 🔑 车辆操作区（取消排查/解锁/新增车辆/导入）：
    //    后端 buttonControl.addVehicleButton（仅进行中可操作）+ 新增车辆权限
    canOperateVehicle () {
      return !!this.buttonControl.addVehicleButton &&
        this.permissions.has(this.moduleKey + '-addVehicle');
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    FetchSelect,
    TagInput,
    EditPageLayout,
    EditBaseContainer,
    AisAttachment,
    Upload
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '车辆排查任务',
      pageType: 'edit',
      moduleKey: 'AISVS-risktask-riskCheckTask',
      loading: false,
      submitLoading: false,
      // 🔑 全量用户角色（权限），供「推送对象」下拉与详情回显；value=编码、label=名称
      authorityOptions: [],
      form,
      // 🔑 附件走前端规则（不请求 attachmentConfig/getByCodeWithBusinessData）
      attachmentUploadConfig: ATTACHMENT_UPLOAD_CONFIG,
      // ==================== 排查车辆清单（T10） ====================
      detailForm: {
        vinList: [],
        vehicleTypeList: [],
        seriesIdList: [],
        modelIdList: [],
        yearTypeIdList: [],
        exteriorIdList: [],
        interiorIdList: [],
        saleDealerNameList: [],
        deliveryDealerNameList: [],
        vehicleStatusList: [],
        lockStatusList: [],
        checkStatusList: []
      },
      detailTableData: [],
      detailLoading: false,
      detailPageNum: 1,
      detailPageSize: 10,
      detailTotal: 0,
      detailSelection: [],
      // 🔑 发布任务 loading
      publishLoading: false,
      // 🔑 新增车辆弹框
      addVehicleDialogVisible: false,
      addVinList: [],
      addVehicleLoading: false,
      // 🔑 Excel 导入车辆明细弹框（通用导入引擎，按模板 code 服务端路由）
      importVisible: false,
      // 主数据远程下拉（车系/车型/年款/外观/内饰）
      seriesList: [],
      modelList: [],
      yearTypeList: [],
      exteriorList: [],
      interiorList: [],
      // 🔑 必须各自调用工厂：浅拷贝会让 form / originalForm 共享同一个 pushConfigList 数组引用，
      //    导致增删行时路由拦截的脏检查失效
      originalForm: this.getDefautlForm(),
      rules: {
        taskName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        checkReason: [
          { required: true, message: '请输入排查原因', trigger: 'blur' }
        ],
        checkMethod: [
          { required: true, message: '请输入排查方法', trigger: 'blur' }
        ],
        taskRequirement: [
          { required: true, message: '请输入任务要求', trigger: 'blur' }
        ],
        lockVehicleFlag: [
          { required: true, message: '请选择是否锁车', trigger: 'change' }
        ],
        auditType: [
          { required: true, message: '请选择审核方式', trigger: 'change' }
        ],
        // 🔑 仅自动审核时系统版本号必填（后端 G21）
        vehicleSystemVersion: [
          {
            validator: (rule, value, callback) => {
              if (this.showSystemVersion && !value) {
                callback(new Error('自动审核任务必须填写系统版本号'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ]
        // 🔑 推送配置 4 项的行级校验挂在表格内的 el-form-item（见 PUSH_CONFIG_RULES），
        //    顶层 rules 只保留「至少 1 行」的兜底提示（在 submitRequest 中拦截）
      }
    };
  },
  mounted () {
    // 🔑 进入页面即拉全量角色，供「推送对象」下拉与详情回显使用
    this.loadAuthorityOptions();
    // 🔑 已有任务ID（编辑态）则直接拉排查车辆清单
    if (this._id) {
      this.queryDetailList();
    }
  },
  watch: {
    // 🔑 新建保存后路由带上 ?id=，或由列表跳入编辑时，ID 变化即重载清单
    _id (val) {
      if (val) {
        this.detailPageNum = 1;
        this.queryDetailList();
      }
    }
  },
  methods: {
    openPane () {
      this.$refs.editLayout.openPane();
    },
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
      return {};
    },
    /**
     * 详情回显转换：推送配置是 JSON 数组（每行一条规则），逐行归一化后直接给表格
     */
    transformDetail (res) {
      const data = { ...(res || {}) };
      data.pushConfigList = this.normalizePushConfigList(data.pushConfigList);
      return data;
    },
    /**
     * 归一化推送配置行：补缺失字段 + 多值码值统一转字符串
     * 🔑 多选 el-select 回显按「严格相等」匹配 option.value，
     *    后端传 Integer（11/1/10），前端静态 options 的 value 是字符串，必须转成字符串才回显得出
     */
    normalizePushConfigList (list) {
      const rows = Array.isArray(list) ? list : [];
      if (!rows.length) {
        return [createPushConfigRow()];
      }
      return rows.map(row => {
        const item = row || {};
        return {
          vehicleStatusList: this.splitToArray(item.vehicleStatusList).map(String),
          vehicleCategoryList: this.splitToArray(item.vehicleCategoryList).map(String),
          storeCategory: item.storeCategory === null || item.storeCategory === undefined ? '' : item.storeCategory,
          pushUserRoleList: this.splitToArray(item.pushUserRoleList)
        };
      });
    },
    // 逗号串 / 单值 → 数组（兼容后端早期逗号串存储）
    splitToArray (value) {
      if (Array.isArray(value)) {
        return value;
      }
      if (value === null || value === undefined || value === '') {
        return [];
      }
      return String(value)
        .split(',')
        .map(item => item.trim())
        .filter(item => item !== '');
    },
    // 新增一行推送配置
    addPushConfigRow () {
      this.form.pushConfigList.push(createPushConfigRow());
      this.clearPushConfigValidate();
    },
    // 删除任意一行（不限制最后一行，保存时由 submitRequest 兜底校验至少 1 行）
    removePushConfigRow (index) {
      this.form.pushConfigList.splice(index, 1);
      this.clearPushConfigValidate();
    },
    /**
     * 清空推送配置表格的校验态
     * 🔑 el-form-item 的 prop 带行索引（pushConfigList.0.xxx），增删行会让索引位移，
     *    残留的报错红字会错位显示到别的行上，所以增删后统一清一次
     */
    clearPushConfigValidate () {
      this.$nextTick(() => {
        if (this.$refs.ruleForm3) {
          this.$refs.ruleForm3.clearValidate();
        }
      });
    },
    // 详情区文案：车辆状态码值 → 中文
    statusText (list) {
      const map = {};
      VEHICLE_STATUS_OPTIONS.forEach(item => {
        map[item.value] = item.label;
      });
      return (list || []).map(item => map[String(item)] || item).join('、');
    },
    // 详情区文案：车辆类型码值 → 中文
    categoryText (list) {
      return (list || []).map(item => VEHICLE_CATEGORY_LABEL[String(item)] || item).join('、');
    },
    // 详情区文案：门店分类码值 → 中文
    storeCategoryText (code) {
      return STORE_CATEGORY_LABEL[String(code)] || code || '';
    },
    // 详情区文案：推送对象（角色编码）→ 角色名称
    pushUserRoleText (list) {
      const map = {};
      this.authorityOptions.forEach(o => {
        map[o.authorityCode] = o.authorityName;
      });
      return (list || []).map(code => map[code] || code).join('、');
    },
    submitRequest () {
      // 🔑 表格可以整行删空，提交前兜底「至少 1 行」（对齐后端 G22）
      if (!Array.isArray(this.form.pushConfigList) || !this.form.pushConfigList.length) {
        this.$message.warning('请至少配置一条推送配置');
        return Promise.reject(new Error('请至少配置一条推送配置'));
      }
      // 🔑 只提交表格中最终剩余的行，删除的行不进参
      const params = {
        ...this.form,
        pushConfigList: this.form.pushConfigList
      };
      // 新建走 addOrUpdate（POST），编辑走 update（PUT）
      if (this._id) {
        // 🔑 id 以 _id 为准：新建保存后 form.id 要等详情回查才回填
        return update({ ...params, id: this._id });
      }
      // 🔑 第 1 步：创建任务，返回任务ID（容器用它 replace 路由，带上 ?id=xxx）
      //    注意：此处不要提前写 this.form.id —— 会让容器的 this.id 提前为真，
      //    容器将走「编辑」分支而不再把ID同步到路由
      return addOrUpdate(params);
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    /**
     * 拉全量用户角色（权限）：/passport/authorityInfo/page
     * 🔑 落库用 authorityCode（编码）、展示用 authorityName（名称），对齐 salesConfig 门店查询配置
     */
    loadAuthorityOptions () {
      getAuthorityList({ page: 1, size: 1000 }).then(res => {
        this.authorityOptions = (res && res.records) || [];
      }).catch(() => {
        this.authorityOptions = [];
      });
    },
    // ==================== 排查车辆清单（T10） ====================
    handleDetailQuery () {
      this.detailPageNum = 1;
      this.queryDetailList();
    },
    handleDetailReset () {
      Object.keys(this.detailForm).forEach(key => { this.detailForm[key] = []; });
      this.detailPageNum = 1;
      this.queryDetailList();
    },
    /**
     * 分页查询当前排查任务的明细（后端 VehicleRiskCheckTaskDetailController#page）。
     * 🔑 响应兼容两种形态：AjaxResult 包裹（res.data.records）或直接 PageResult（res.records）。
     */
    queryDetailList () {
      if (!this._id) {
        return;
      }
      const f = this.detailForm;
      const params = {
        checkTaskId: this._id,
        pageNum: this.detailPageNum,
        pageSize: this.detailPageSize,
        vinList: this.toArr(f.vinList),
        vehicleTypeList: this.toNumList(f.vehicleTypeList),
        seriesIdList: this.toArr(f.seriesIdList),
        modelIdList: this.toArr(f.modelIdList),
        yearTypeIdList: this.toArr(f.yearTypeIdList),
        exteriorIdList: this.toArr(f.exteriorIdList),
        interiorIdList: this.toArr(f.interiorIdList),
        saleDealerNameList: this.toArr(f.saleDealerNameList),
        deliveryDealerNameList: this.toArr(f.deliveryDealerNameList),
        vehicleStatusList: this.toNumList(f.vehicleStatusList),
        lockStatusList: this.toNumList(f.lockStatusList),
        checkStatusList: this.toNumList(f.checkStatusList)
      };
      this.detailLoading = true;
      getDetailList(params).then(res => {
        const data = (res && res.data) ? res.data : res;
        this.detailTableData = (data && data.records) || [];
        this.detailTotal = (data && (data.total !== null && data.total !== undefined ? data.total : data.totals)) || 0;
      }).catch(() => {
        this.detailTableData = [];
        this.detailTotal = 0;
      }).finally(() => {
        this.detailLoading = false;
      });
    },
    // 空数组 -> null（后端忽略 null，空数组也忽略，这里统一收敛避免传空集合）
    toArr (arr) {
      return (arr && arr.length) ? arr : null;
    },
    // 枚举多选返回的是字符串码值，后端字段为 Integer/List<Integer>，统一转 Number
    toNumList (arr) {
      return (arr && arr.length) ? arr.map(item => Number(item)) : null;
    },
    handleDetailSelectionChange (selection) {
      this.detailSelection = selection;
    },
    handleDetailSizeChange (size) {
      this.detailPageSize = size;
      this.queryDetailList();
    },
    handleDetailCurrentChange (page) {
      this.detailPageNum = page;
      this.queryDetailList();
    },
    // 主数据远程搜索：车系/车型/年款/外观/内饰
    async seriesSearch (query) {
      try {
        const res = await vehicleSeriesList({ seriesNameLike: query });
        this.seriesList = res || [];
        return res;
      } catch (e) {
        this.seriesList = [];
        return [];
      }
    },
    async modelSearch (query) {
      try {
        const res = await vehicleModelList({ modelNameLike: query || '', size: 1000, limitSize: 500 });
        this.modelList = res || [];
        return res;
      } catch (e) {
        this.modelList = [];
        return [];
      }
    },
    async yearTypeSearch (query) {
      try {
        const res = await listVehicleYearType({ yearTypeNameLike: query });
        this.yearTypeList = res || [];
        return res;
      } catch (e) {
        this.yearTypeList = [];
        return [];
      }
    },
    async exteriorSearch (query) {
      try {
        const res = await vehicleExterior({ exteriorNameLike: query || '' });
        this.exteriorList = res || [];
        return res;
      } catch (e) {
        this.exteriorList = [];
        return [];
      }
    },
    async interiorSearch (query) {
      try {
        const res = await vehicleInterior({ interiorNameLike: query || '' });
        this.interiorList = res || [];
        return res;
      } catch (e) {
        this.interiorList = [];
        return [];
      }
    },
    // 车辆状态中文（台账码值无 DictEnumType 自动 Label）
    formatVehicleStatus (value) {
      if (value === null || value === undefined || value === '') {
        return '';
      }
      return VEHICLE_STATUS_MAP[String(value)] || value;
    },
    // 取消排查（G9：已排查不可取消，由后端拦截；支持单条/批量：选中 1 行=单、多行=批）
    handleCancelCheck () {
      if (!this.detailSelection.length) {
        return;
      }
      const list = this.detailSelection;
      this.$confirm(`确认取消排查选中的 ${list.length} 辆车？已排查的将被后端跳过`, '提示', { type: 'warning' })
        .then(() => Promise.all(list.map(row => cancelCheck({ detailId: row.id }))))
        .then(() => {
          this.$message.success('批量取消排查成功');
          this.queryDetailList();
        })
        .catch(() => {});
    },
    // 车辆解锁（G10：已解锁不重复操作，由后端拦截；支持单条/批量）
    handleUnlockVehicle () {
      if (!this.detailSelection.length) {
        return;
      }
      const list = this.detailSelection;
      this.$confirm(`确认解锁选中的 ${list.length} 辆车？已解锁的将被后端跳过`, '提示', { type: 'warning' })
        .then(() => Promise.all(list.map(row => unlockVehicle({ detailId: row.id }))))
        .then(() => {
          this.$message.success('批量解锁成功');
          this.queryDetailList();
        })
        .catch(() => {});
    },
    // 一键提醒（统计待排查数并发事件）
    handleOneClickRemind () {
      if (!this._id) {
        return;
      }
      oneClickRemind({ checkTaskId: this._id })
        .then(res => {
          const cnt = (res && res.data !== null && res.data !== undefined) ? res.data : res;
          const tip = (typeof cnt === 'number') ? `，待排查 ${cnt} 辆` : '';
          this.$message.success(`一键提醒已发送${tip}`);
        })
        .catch(() => {});
    },
    // 发布任务：草稿 → 进行中（后端仅允许 10→60）
    handlePublish () {
      if (!this._id || !this.isDraft) {
        return;
      }
      this.$confirm('确认发布该任务？发布后状态变为「进行中」，推送配置将不可再编辑。', '发布任务', { type: 'warning' })
        .then(() => {
          this.publishLoading = true;
          return publishTask({ checkTaskId: this._id });
        })
        .then(() => {
          this.$message.success('发布成功，任务已进入进行中');
          // 🔑 刷新详情：状态变 60 → 发布按钮消失、推送配置转只读、车辆操作可用
          if (this.$refs.containerRef && this.$refs.containerRef.loadDetail) {
            this.$refs.containerRef.loadDetail();
          }
          this.queryDetailList();
        })
        .catch(() => {})
        .finally(() => {
          this.publishLoading = false;
        });
    },
    // 打开新增车辆弹框（仅在「进行中」可用，按钮层已用 canOperateVehicle 兜底）
    handleAddVehicle () {
      if (!this.canOperateVehicle) {
        return;
      }
      this.addVehicleDialogVisible = true;
    },
    // 确认新增车辆：批量 VIN 调后端 addVehicle（仅进行中，重复 VIN 后端跳过）
    confirmAddVehicle () {
      const vinList = (this.addVinList || []).map(v => String(v).trim()).filter(v => v);
      if (!vinList.length) {
        this.$message.warning('请至少输入一个车辆VIN');
        return;
      }
      if (vinList.length > 200) {
        this.$message.warning('单次最多新增 200 辆车');
        return;
      }
      this.addVehicleLoading = true;
      addVehicle({ checkTaskId: this._id, vinList })
        .then(() => {
          this.$message.success(`新增 ${vinList.length} 辆车成功`);
          this.addVehicleDialogVisible = false;
          this.addVinList = [];
          this.queryDetailList();
        })
        .catch(() => {})
        .finally(() => {
          this.addVehicleLoading = false;
        });
    },
    // 打开 Excel 导入（通用导入引擎，仅「进行中」）
    openImport () {
      if (!this.canOperateVehicle) {
        return;
      }
      this.importVisible = true;
    },
    getDefautlForm () {
      return {
        ...defaultForm,
        // 🔑 新建默认给一行，且必须新造数组（defaultForm 是模块级常量）
        pushConfigList: [createPushConfigRow()]
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.push-config-table {
  margin-bottom: 12px;
  border-radius: 4px;
  overflow: hidden; // 让 border 表格的圆角真正生效

  // ---- 表头：浅灰底 + 加粗，和内容行拉开层次 ----
  ::v-deep .el-table__header-wrapper th {
    height: 44px;
    padding: 0;
    background-color: #f5f7fa;
    color: #303133;
    font-size: 13px;
    font-weight: 600;
  }

  // ---- 单元格：上下留白 + 垂直居中，保证行高稳定 ----
  ::v-deep td {
    padding: 9px 0;
    vertical-align: middle;
  }

  ::v-deep .cell {
    padding: 0 12px;
  }

  // ---- 行悬浮高亮，方便横向对齐某一行的四列 ----
  ::v-deep .el-table__body tr:hover > td {
    background-color: var(--leap-color-primary-light-9);
  }

  // ---- 表格内嵌表单：去掉默认下边距；校验提示改为占据行内空间，避免盖住下一行 ----
  ::v-deep .el-form-item {
    margin-bottom: 0;
  }

  ::v-deep .el-form-item__error {
    position: static;
    padding-top: 4px;
    font-size: 12px;
    line-height: 1.2;
  }

  // ---- 下拉框铺满单元格，选中文字不再被压缩 ----
  ::v-deep .el-select {
    width: 100%;
  }

  // ---- 多选展示全部选中值并自动换行 ----
  // 1) 覆盖 FetchSelect 组件内强制的 flex-wrap: nowrap（加 !important 保证优先级）
  // 2) 给右侧箭头图标让位，tags 在剩余宽度内换行
  // 3) el-select 在 filterable 下会按 tags 实际高度自动撑高输入框（resetInputHeight），行高随之增长
  ::v-deep .push-config-select .el-select__tags {
    flex-wrap: wrap !important;
    white-space: normal;
    max-width: calc(100% - 30px);
  }

  // tag 内容不做省略，保证每个选中值完整可见
  ::v-deep .el-select__tags-text {
    max-width: none;
  }

  // 换行后的 tag 行距紧凑一些
  ::v-deep .push-config-select .el-tag {
    margin-top: 2px;
    margin-bottom: 2px;
  }
}

.push-config-footer {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.push-config-tip {
  font-size: 12px;
  color: #909399;
  line-height: 20px;
}

.push-config-empty {
  display: block;
  padding: 16px 0;
  font-size: 12px;
  color: #909399;
}

.push-config-remove {
  color: #f56c6c;

  &:hover {
    color: #e64242;
  }
}

// ---- 排查车辆清单（T10） ----
.detail-search-form {
  display: flex;
  flex-wrap: wrap;
}

.detail-search-form .form-item-btns {
  margin-left: auto;
}

.detail-actions {
  margin: 4px 0 12px;
}

.add-vehicle-tip {
  font-size: 12px;
  color: #909399;
  line-height: 20px;
}

.detail-pagination {
  text-align: right;
  margin-top: 12px;
}
</style>
