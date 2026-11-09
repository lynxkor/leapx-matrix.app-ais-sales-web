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
                          <el-tooltip
                            :content="statusText(scope.row.vehicleStatusList)"
                            :disabled="!(scope.row.vehicleStatusList || []).length"
                            placement="top"
                            effect="light"
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
                            />
                          </el-tooltip>
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
                          <el-tooltip
                            :content="categoryText(scope.row.vehicleCategoryList)"
                            :disabled="!(scope.row.vehicleCategoryList || []).length"
                            placement="top"
                            effect="light"
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
                            />
                          </el-tooltip>
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
                          <el-tooltip
                            :content="pushUserRoleText(scope.row.pushUserRoleList)"
                            :disabled="!(scope.row.pushUserRoleList || []).length"
                            placement="top"
                            effect="light"
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
                            />
                          </el-tooltip>
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

              <!-- 操作区：可见 = 有权限 AND 后端 buttonControl 允许；值为 false 的按钮不渲染（需求：不能只禁用） -->
              <div class="ais-actions detail-actions">
                <!-- 取消排查：后端 buttonControl.cancelCheckButton（已结束隐藏）+ 取消排查权限点 -->
                <el-button v-if="canCancelCheck" size="small" type="primary" plain :disabled="detailSelection.length === 0" @click="handleCancelCheck">取消排查</el-button>
                <!-- 删除：仅【草稿】状态可删除排查明细（后端 buttonControl.deleteDetailButton + 删除权限点） -->
                <el-button
                  v-if="canDeleteDetail"
                  size="small"
                  type="danger"
                  plain
                  :disabled="detailSelection.length === 0"
                  @click="handleDeleteDetail"
                >删除</el-button>
                <!-- 车辆解锁：后端 buttonControl.unlockVehicleButton（已结束隐藏）+ 解锁权限点 -->
                <el-button v-if="canUnlockVehicle" size="small" type="primary" plain :disabled="detailSelection.length === 0" @click="handleUnlockVehicle">车辆解锁</el-button>
                <!-- 新增车辆：后端 buttonControl.addVehicleButton（草稿/进行中可操作）+ 新增车辆权限点 -->
                <el-button v-if="canAddVehicle" size="small" type="primary" plain @click="handleAddVehicle">新增车辆</el-button>
                <!-- 导入：后端 buttonControl.importVehicleButton（草稿/进行中可操作）+ 导入权限点 -->
                <el-button v-if="canImportVehicle" size="small" type="primary" plain @click="openImport">导入</el-button>
                <el-button size="small" @click="handleOneClickRemind">一键提醒</el-button>
              </div>

              <!-- 表格：与任务列表页 /vehstock/risktask/riskCheckTask 使用同一套 LPVxeTable
                   （斑马纹 + border="inner" + 行高 40 + 表头样式 + 右浮动「共 N 条」分页 + 表格设置），
                   保证详情页与列表页表格视觉完全一致 -->
              <div class="detail-table-wrap">
                <LPVxeTable
                  ref="detailTable"
                  v-loading="detailLoading"
                  is-checkbox
                  is-page
                  checkboxFixed
                  :option-obj="detailTableOption"
                  :get-config="getDetailTableConfig"
                  :save-or-update="saveDetailTableOrUpdate"
                  @paginationChange="handleDetailPaginationChange"
                  @handleSelect="handleDetailSelectionChange"
                />
              </div>
            </div>
          </section>

          <!-- 新增车辆：批量 VIN 录入（同筛选区 TagInput，支持回车分隔） -->
          <!-- 🔑 append-to-body：弹框默认渲染在 .page-common-edit 内部，会命中 pages.scss 里
               .page-common-edit .el-form-item{width:33.3%;display:flex}，把 label 挤到换行；
               移出到 body 后恢复 element 默认布局（label 定宽 90px 右对齐，不换行） -->
          <el-dialog title="新增车辆" :visible.sync="addVehicleDialogVisible" width="560px" append-to-body @close="addVinList = []">
            <!-- 🔑 @submit.native.prevent：TagInput 单条输入框是裸 <input>，且本 el-form 内只有这一个 input、
                 又没有 submit 按钮，正好命中浏览器「隐式表单提交」（Implicit Submission）条件——
                 回车会触发原生 GET 提交，URL 的 ?id= 被表单序列化结果覆盖，路由变成无 id 的新增页。
                 阻止原生提交后，回车只走 TagInput 的 @keyup.enter 逻辑（VIN 落成一个 tag） -->
            <el-form label-width="90px" class="add-vehicle-form" @submit.native.prevent>
              <el-form-item label="车辆VIN：">
                <tag-input v-model="addVinList" placeholder="支持批量，回车分隔，每行一个VIN" style="width:100%" />
              </el-form-item>
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
import { getDetailList, cancelCheck, unlockVehicle, deleteDetail, oneClickRemind } from '@/api/vehstock/risktask/riskCheckTaskDetail/index';
import FetchSelect from '@/libs/components/FetchSelect';
import TagInput from '@/libs/components/TagInput';
import { getEnum, getTableConfig, tableAddOrUpdate, vehicleSeriesList, vehicleModelList, listVehicleYearType, vehicleExterior, vehicleInterior } from '@/api/common';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import AisAttachment from '@/libs/components/AisAttachment/index.vue';
import Upload from '@/libs/components/UploadDialog';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
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
    // 🔑 发布按钮：后端 buttonControl.publishButton（仅草稿且有排查车辆清单可发布，
    //    清单为空时后端同源返回 false，按钮直接不渲染）+ 发布权限；
    //    前端兜底「车辆数量>0」：新建未保存（无 id、无 buttonControl 回包）或数据未加载时不露出
    canPublish () {
      const hasVehicle = Number(this.form.totalVehicleCount) > 0;
      return !!this._id && hasVehicle && !!this.buttonControl.publishButton &&
        this.permissions.has(this.moduleKey + '-publish');
    },
    // 🔑 车辆操作按钮可见性：可见 = 有权限 AND 后端 buttonControl 允许（值为 false 的按钮不渲染，仅禁用不满足需求）
    // 取消排查：后端 buttonControl.cancelCheckButton（已结束隐藏）+ 取消排查权限点
    canCancelCheck () {
      return !!this.buttonControl.cancelCheckButton &&
        this.permissions.has(this.moduleKey + '-detail-cancelCheck');
    },
    // 车辆解锁：后端 buttonControl.unlockVehicleButton（已结束隐藏）+ 解锁权限点
    canUnlockVehicle () {
      return !!this.buttonControl.unlockVehicleButton &&
        this.permissions.has(this.moduleKey + '-detail-unlockVehicle');
    },
    // 新增车辆：后端 buttonControl.addVehicleButton（草稿/进行中可操作）+ 新增车辆权限点
    canAddVehicle () {
      return !!this.buttonControl.addVehicleButton &&
        this.permissions.has(this.moduleKey + '-addVehicle');
    },
    // 导入：后端 buttonControl.importVehicleButton（草稿/进行中可操作）+ 导入权限点
    canImportVehicle () {
      return !!this.buttonControl.importVehicleButton &&
        this.permissions.has(this.moduleKey + '-importVehicle');
    },
    // 🔑 删除排查明细：后端 buttonControl.deleteDetailButton（仅草稿可删）+ 删除权限点
    canDeleteDetail () {
      return !!this.buttonControl.deleteDetailButton &&
        this.permissions.has(this.moduleKey + '-detail-delete');
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    FetchSelect,
    TagInput,
    EditPageLayout,
    EditBaseContainer,
    AisAttachment,
    Upload,
    LPVxeTable
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
      // 🔑 排查车辆清单表格配置：与列表页 /vehstock/risktask/riskCheckTask 同款 LPVxeTable
      //    id（tableCode）独立于列表页的 riskCheckTaskTable，避免两个页面的用户表头配置互相污染
      detailTableOption: {
        id: 'riskCheckTaskEditDetailTable',
        dataList: [],
        form: {
          page: 1,
          size: 20
        },
        dataProp: [
          // 🔑 LPVxeTable 只把 width 透传给 vxe-column（minWidth 不生效，会退化成 auto 宽），
          //    这里全部用 width 定宽，视觉与列表页一致；最后一列（排检时间）由组件按剩余宽度自适应
          { props: 'vin', label: 'VIN', visible: true, width: 190, fixed: 'left' },
          { props: 'saleDealerName', label: '销售门店', visible: true, width: 140 },
          { props: 'deliveryDealerName', label: '交付门店', visible: true, width: 140 },
          { props: 'vehicleTypeLabel', label: '车辆类型', visible: true, width: 100 },
          { props: 'seriesName', label: '车系名称', visible: true, width: 120 },
          { props: 'modelName', label: '车型名称', visible: true, width: 120 },
          { props: 'yearTypeName', label: '年款', visible: true, width: 100 },
          { props: 'exteriorName', label: '外观名称', visible: true, width: 120 },
          { props: 'interiorName', label: '内饰名称', visible: true, width: 120 },
          { props: 'vehicleStatusLabel', label: '车辆状态', visible: true, width: 110 },
          { props: 'checkStatusLabel', label: '排检状态', visible: true, width: 100 },
          { props: 'lockStatusLabel', label: '锁定状态', visible: true, width: 100 },
          { props: 'checkTime', label: '排查时间', visible: true, width: 170 }
        ],
        total: 0
      },
      detailLoading: false,
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
        this.detailTableOption.form.page = 1;
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
      this.detailTableOption.form.page = 1;
      this.queryDetailList();
    },
    handleDetailReset () {
      Object.keys(this.detailForm).forEach(key => { this.detailForm[key] = []; });
      this.detailTableOption.form.page = 1;
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
        pageNum: this.detailTableOption.form.page,
        pageSize: this.detailTableOption.form.size,
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
      // 🔑 换页/重新查询后清空选中行（原 el-table 换数据会自动清空，vxe-table 不会）
      this.detailSelection = [];
      getDetailList(params).then(res => {
        const data = (res && res.data) ? res.data : res;
        this.detailTableOption.dataList = (data && data.records) || [];
        this.detailTableOption.total = (data && (data.total !== null && data.total !== undefined ? data.total : data.totals)) || 0;
      }).catch(() => {
        this.detailTableOption.dataList = [];
        this.detailTableOption.total = 0;
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
    /**
     * LPVxeTable 选中行回调（@handleSelect）
     * 🔑 返回的是表格行对象（含 id），与原 el-table selection-change 语义一致
     */
    handleDetailSelectionChange (selection) {
      this.detailSelection = selection || [];
    },
    /**
     * LPVxeTable 分页回调（@paginationChange）
     * 🔑 type: 'page' 翻页 / 'size' 改每页条数
     */
    handleDetailPaginationChange (type, num) {
      if (type === 'page') {
        this.detailTableOption.form.page = num;
      } else {
        this.detailTableOption.form.size = num;
        // 🔑 改每页条数后回到第 1 页，否则停留在旧页码可能超出新的总页数
        this.detailTableOption.form.page = 1;
      }
      this.queryDetailList();
    },
    /**
     * 表格用户列配置读取（LPVxeTable 必传 get-config）
     */
    getDetailTableConfig () {
      return new Promise((resolve) => {
        getTableConfig(this.detailTableOption.id).then(data => {
          resolve({ data });
        }).catch(err => {
          console.error('排查车辆清单表格配置读取失败:', err);
          resolve({ data: null });
        });
      });
    },
    /**
     * 表格用户列配置保存（LPVxeTable 必传 save-or-update）
     */
    saveDetailTableOrUpdate (data) {
      return tableAddOrUpdate(data);
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
    // 取消排查（G9：已排查不可取消，由后端拦截；支持单条/批量：选中 1 行=单、多行=批）
    // 🔑 后端契约：checkTaskId 必填（@NotEmpty），detailIds 为数组，一次请求提交全部选中行（后端逐条校验 G9）
    handleCancelCheck () {
      if (!this.detailSelection.length) {
        return;
      }
      const detailIds = this.detailSelection.map(row => row.id);
      this.$confirm(`确认取消排查选中的 ${detailIds.length} 辆车？已排查的将被后端跳过`, '提示', { type: 'warning' })
        .then(() => cancelCheck({ checkTaskId: this._id, detailIds }))
        .then(() => {
          this.$message.success('批量取消排查成功');
          this.queryDetailList();
        })
        .catch(() => {});
    },
    // 车辆解锁（G10：已解锁不重复操作，由后端拦截；支持单条/批量）
    // 🔑 后端契约：detailIds 为数组，一次请求提交全部选中行
    handleUnlockVehicle () {
      if (!this.detailSelection.length) {
        return;
      }
      const detailIds = this.detailSelection.map(row => row.id);
      this.$confirm(`确认解锁选中的 ${detailIds.length} 辆车？已解锁的将被后端跳过`, '提示', { type: 'warning' })
        .then(() => unlockVehicle({ detailIds }))
        .then(() => {
          this.$message.success('批量解锁成功');
          this.queryDetailList();
        })
        .catch(() => {});
    },
    // 删除排查明细（仅草稿态可删除；后端会重算主任务与门店子任务的车辆数）
    handleDeleteDetail () {
      if (!this.canDeleteDetail || !this.detailSelection.length) {
        return;
      }
      const detailIds = this.detailSelection.map(row => row.id);
      this.$confirm(`确认删除选中的 ${detailIds.length} 辆车？删除后该车辆将从本次排查任务中移除`, '提示', { type: 'warning' })
        .then(() => deleteDetail({ checkTaskId: this._id, detailIds }))
        .then(() => {
          this.$message.success('删除成功');
          this.queryDetailList();
          // 🔑 刷新详情：主任务「车辆数量/完成数量」已被后端重算，需回显最新值
          if (this.$refs.containerRef && this.$refs.containerRef.loadDetail) {
            this.$refs.containerRef.loadDetail();
          }
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
    // 打开新增车辆弹框（可见性已由 canAddVehicle 控制，此处兜底）
    handleAddVehicle () {
      if (!this.canAddVehicle) {
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
          // 🔑 刷新详情：后端 addVehicle 已累加主任务 total_vehicle_count（batchAddDetails 乐观锁更新），
          //    「车辆数量/剩余数量」需重新请求 getDetail 回显最新值（与 handleDeleteDetail 同一模式）
          if (this.$refs.containerRef && this.$refs.containerRef.loadDetail) {
            this.$refs.containerRef.loadDetail();
          }
        })
        .catch(() => {})
        .finally(() => {
          this.addVehicleLoading = false;
        });
    },
    // 打开 Excel 导入（通用导入引擎，可见性已由 canImportVehicle 控制，此处兜底）
    openImport () {
      if (!this.canImportVehicle) {
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

  // ---- 多选下拉：沿用 FetchSelect 组件默认 collapse-tags 单行收起（+N），对齐 salesConfig 销售顾问配置 ----
  // 悬浮完整内容见各列 el-tooltip；不再强制展开换行，避免表格行高随选中项数量增长
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

// 排查车辆清单表格：与列表页同款 LPVxeTable
// 🔑 LPVxeTable 内部按「容器高度」分配表格区与分页区（表格区 = 容器高 - 50px），
//    编辑页是滚动流页面、没有列表页那种「剩余视口高度」，所以这里给固定高度
.detail-table-wrap {
  height: 520px;

  // 表格设置齿轮按钮默认 top:-45px；编辑页 .ais-actions 只留 12px 下边距（列表页是 16px），
  // 这里调到 -40px 让齿轮按钮与上方「取消排查/删除/解锁」按钮行右侧对齐
  ::v-deep .m-vxe-table-options {
    top: -40px;
  }
}

.add-vehicle-tip {
  font-size: 12px;
  color: #909399;
  line-height: 20px;
}

// 新增车辆弹框：label 不换行（弹框已 append-to-body 移出 .page-common-edit，
// 这里再兜一层，防止后续有人去掉 append-to-body 时标签再次被挤断）
.add-vehicle-form {
  ::v-deep .el-form-item__label {
    white-space: nowrap;
  }
}
</style>
