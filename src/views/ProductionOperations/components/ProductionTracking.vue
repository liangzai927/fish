<!-- 生产进度跟踪 -->
<template>
  <div class="tracking">
    <div class="task-detail">
      <div class="title">
        <p>{{ detailsData?.mfgCode }}</p>
      </div>
      <div class="body">
        <p>
          {{
            $t("productionOperation.taskCard.mfgCode") +
            ":" +
            detailsData?.mfgCode
          }}
        </p>
        <p>
          {{
            $t("productionOperation.taskCard.maName") +
            ":" +
            detailsData?.maName
          }}
        </p>
        <p style="display: inline">
          {{ $t("productionOperation.taskCard.meterailName") + ":" }}
        </p>
        <span style="color: #1890ff" @click.stop="showBom = true"
          >点击查询</span
        >
        <!-- <van-button @click="testMaterial">点击</van-button> -->
        <p
          v-if="
            detailsData &&
            detailsData.beginTime != null &&
            detailsData.endTime != null
          "
        >
          {{
            $t("productionOperation.taskCard.planTime") +
            ":" +
            detailsData?.beginTime +
            "~" +
            detailsData?.endTime
          }}
        </p>
        <p v-else>
          {{ $t("productionOperation.taskCard.planTime") + ":" + "工单未排产" }}
        </p>
        <p>
          {{
            $t("productionOperation.taskCard.unit") +
            ":" +
            detailsData?.extQty +
            detailsData?.stu
          }}
        </p>
      </div>
    </div>
    <div class="process">
      <van-tabs
        v-if="operateListData.length > 0"
        v-model:active="activeTab"
        shrink
        @change="handelChangeTab"
      >
        <van-tab
          :title="item.operateName"
          :name="item.operateId"
          v-for="item in operateListData"
          :key="item.operateId"
        >
          <van-steps
            direction="vertical"
            :active="activeStep"
            v-if="processList.length > 0"
          >
            <van-step
              v-for="(task, index) in processList"
              :key="index.toString()"
            >
              <template #active-icon v-if="chooseTabData.operateStatus !== 3">
                <van-loading type="spinner" size="12" color="#1989fa" />
              </template>
              <template #active-icon v-else>
                <van-icon name="checked" size="12" color="#1989fa" />
              </template>
              <template #finish-icon>
                <van-icon name="checked" size="12" color="#1989fa" />
              </template>

              <template v-if="Array.isArray(task)">
                <div v-for="(item, i) in task" :key="item.taskId">
                  <van-button
                    v-if="task.length > 1"
                    style="margin-bottom: 4px"
                    :type="taskIndex == i ? 'primary' : 'default'"
                    size="small"
                    @click.stop="clickTask(i, task)"
                    class="mb8"
                  >
                    {{ item.taskName }}
                  </van-button>
                  <h3 style="padding-bottom: 1vw" v-else>
                    {{ item.taskName }}
                  </h3>
                  <p v-if="item.assigneeName">
                    <span
                      >{{
                        $t("productionOperation.taskCard.assigneeName")
                      }}：</span
                    >
                    <span>{{ item.assigneeName }}</span>
                  </p>
                  <p v-if="item.finishTime" style="padding-top: 1vw">
                    <span
                      >{{
                        $t("productionOperation.taskCard.complateTime")
                      }}：</span
                    >
                    <span>{{ item.finishTime }}</span>
                  </p>
                  <p
                    v-if="index > 0 && item.finishTime"
                    style="padding-top: 1vw"
                  >
                    <span
                      >{{
                        $t("productionOperation.taskCard.timeTaken")
                      }}：</span
                    >
                    <span>
                      {{
                        calculateTimeDifference(
                          processList[index - 1][i].finishTime,
                          item.finishTime
                        )
                      }}
                    </span>
                  </p>
                  <p
                    v-if="item.taskType === '5' || item.taskType === '4'"
                    style="padding-top: 1vw"
                  >
                    <template v-if="item.taskLocalVars.result">
                      <span v-if="item.taskLocalVars.result == 'true'"
                        >检验结果:合格</span
                      >
                      <span v-if="item.taskLocalVars.result == 'false'">
                        检验结果:不合格
                      </span>
                    </template>
                    <template v-else>
                      <span v-if="item.taskLocalVars?.laboratoryNum == 1"
                        >检验中</span
                      >
                      <span v-else>未发起检验</span>
                    </template>
                  </p>
                  <p v-if="item.taskLocalVars && item.taskLocalVars.tempFeed">
                    临时投料：
                    <span
                      v-for="(ma, idx) in JSON.parse(
                        item.taskLocalVars.tempFeed
                      )"
                      :key="idx"
                    >
                      {{ ma.maName }}
                    </span>
                  </p>
                  <p v-if="item.mfgTrkList && item.mfgTrkList.length > 0">
                    投料:
                    <van-tag
                      v-for="(ma, idx) in item.mfgTrkList"
                      :key="idx"
                      @click="openChangeMa(ma)"
                      style="
                        margin-top: 8px;
                        margin-right: 8px;
                        padding: 3px 9px;
                        cursor: pointer;
                      "
                      color="#7fcaff"
                    >
                      {{
                        `${
                          detailsData.itemDisplay
                            ? ma[detailsData.itemDisplay]
                              ? ma[detailsData.itemDisplay]
                              : ma.maName
                            : ma.maName
                        } (${ma.qty}${ma.stu})`
                      }}
                    </van-tag>
                  </p>
                </div>
              </template>
              <template v-else>
                <h3>{{ task.taskName }}</h3>
                <p v-if="task.assigneeName" style="padding-top: 1vw">
                  <span
                    >{{
                      $t("productionOperation.taskCard.assigneeName")
                    }}：</span
                  >
                  <span>{{ task.assigneeName }}</span>
                </p>
                <p v-if="task.finishTime" style="padding-top: 1vw">
                  <span
                    >{{
                      $t("productionOperation.taskCard.complateTime")
                    }}：</span
                  >
                  <span>{{ task.finishTime }}</span>
                </p>
                <p v-if="index > 0 && item.finishTime" style="padding-top: 1vw">
                  <span
                    >{{ $t("productionOperation.taskCard.timeTaken") }}：</span
                  >
                  <span>
                    {{
                      calculateTimeDifference(
                        processList[index - 1][i].finishTime,
                        item.finishTime
                      )
                    }}
                  </span>
                </p>
                <p v-if="task.taskType == 5" style="padding-top: 1vw">
                  <span v-if="task.taskLocalVars.result == 'true'"
                    >检验结果:合格</span
                  >
                  <span v-if="task.taskLocalVars.result == 'false'"
                    >检验结果:不合格</span
                  >
                  <span v-if="!task.taskLocalVars.result">检验中</span>
                </p>
                <p v-if="task.taskLocalVars && task.taskLocalVars.tempFeed">
                  临时投料：
                  <span
                    v-for="(ma, idx) in JSON.parse(task.taskLocalVars.tempFeed)"
                    :key="idx"
                  >
                    {{ ma.maName }}
                  </span>
                </p>
                <p
                  v-if="
                    task.mfgTrkList &&
                    task.mfgTrkList &&
                    task.mfgTrkList.length > 0
                  "
                >
                  投料:
                  <van-tag
                    v-for="(ma, idx) in task.mfgTrkList"
                    :key="idx"
                    @click="openChangeMa(ma)"
                    style="
                      margin-top: 8px;
                      margin-right: 8px;
                      padding: 3px 9px;
                      cursor: pointer;
                    "
                    color="#7fcaff"
                  >
                    {{
                      `${
                        detailsData.itemDisplay
                          ? ma[detailsData.itemDisplay]
                            ? ma[detailsData.itemDisplay]
                            : ma.maName
                          : ma.maName
                      } (${ma.qty}${ma.stu})`
                    }}
                  </van-tag>
                </p>
              </template>
            </van-step>
          </van-steps>
          <van-empty v-else description="工序未开始" />
        </van-tab>
      </van-tabs>
      <div v-else style="height: calc(100% - 1.5vw - 23px)">
        <BatchInformation
          :list="batchInformationData"
          @refresh="getMixList"
          :batchId="batchDetail.batchId || 0"
        />
      </div>
    </div>
    <div class="button-bottom">
      <!-- 工单当前工序状态chooseTabData.operateStatus:1未开始2进行中3已结束 -->
      <van-button
        type="primary"
        round
        @click="item.click"
        v-for="item in buttonList"
        :key="item.name"
        class="m18"
      >
        {{ item.name }}
      </van-button>
    </div>
    <!-- bomDialog -->
    <van-dialog v-model:show="showBom" title="用料清单">
      <div style="padding: 12px; width: 100%">
        <Mytable
          :data="materialColumns"
          :columns="bomColumns"
          :pageSize="materialColumns.length"
          :height="'500px'"
        >
          <template #bodyCell="{ column, record, text }">
            <template v-if="['materialSequence'].includes(column.prop)">
              <span
                :style="{
                  color:
                    record.extQty !== 0 &&
                    (record.extQty == record.cplQty ||
                      record.extQty < record.cplQty)
                      ? '#4cb45a'
                      : '',
                }"
                >{{
                  `${
                    detailsData.itemDisplay
                      ? record.materialSequence
                        ? record.materialSequence
                        : record.maName
                      : record.maName
                  }`
                }}</span
              >
            </template>
            <template v-else-if="['extQty'].includes(column.prop)">
              <span
                :style="{
                  color:
                    record.extQty !== 0 &&
                    (record.extQty == record.cplQty ||
                      record.extQty < record.cplQty)
                      ? '#4cb45a'
                      : '',
                }"
                >{{ `${record.extQty}${record.stu || ""}` }}</span
              >
            </template>
            <template v-else-if="['cplQty'].includes(column.prop)">
              <span
                :style="{
                  color:
                    record.extQty !== 0 &&
                    (record.extQty == record.cplQty ||
                      record.extQty < record.cplQty)
                      ? '#4cb45a'
                      : '',
                }"
                >{{
                  `${record.cplQty == null ? "" : record.cplQty}${
                    record.cplQty == null ? "" : record.stu || ""
                  }`
                }}</span
              >
            </template>
            <template v-else>
              <span
                :style="{
                  color:
                    record.extQty !== 0 &&
                    (record.extQty == record.cplQty ||
                      record.extQty < record.cplQty)
                      ? '#4cb45a'
                      : '',
                }"
                >{{ text }}</span
              >
            </template>
          </template>
        </Mytable>
      </div>
    </van-dialog>
    <!-- 确认操作 -->
    <van-popup v-model:show="productionShow" round>
      <div class="confirm-content">
        <div
          style="display: flex; justify-content: center; align-items: center"
        >
          <span style="font-size: large; color: #da3231">是否确认?</span>
        </div>
        <div class="button-group">
          <van-button
            round
            block
            @click="productionShow = false"
            size="normal"
            style="width: 45%"
          >
            取消
          </van-button>
          <van-button
            :loading="sureOperationLoading"
            type="primary"
            round
            block
            @click="taskComplete"
            size="normal"
            style="width: 45%"
          >
            确定
          </van-button>
        </div>
      </div>
    </van-popup>

    <!-- 投料 -->
    <van-popup
      v-model:show="feedShow"
      round
      :style="{ padding: '40px', 'min-width': '380px' }"
      @closed="timeIn = false"
    >
      <div class="pop-content">
        <h3 style="text-align: center">投料</h3>
        <van-divider v-if="!changeIn">扫码添加物料 </van-divider>
        <!-- <van-button
          @click="getFeedMeterial('MT.RM200392@@LT.LC10124010194@@SL.000')"
          >+</van-button
        > -->
        <div class="content">
          <div
            class="item-content"
            v-for="(item, index) in materialList"
            :key="index"
          >
            <p class="item-title">{{ "物料" + (index + 1) }}</p>
            <div>
              <van-field
                v-model="item.materialSequence"
                is-link
                readonly
                label="投料物料"
                disabled
                @click="chooseSudMaterial(index)"
              />
              <van-field
                label="投料数量"
                v-model="item.qty"
                :disabled="timeIn"
                type="number"
              />
              <div class="wareFind">
                <div class="intoStorage-content-item">
                  <span class="label">仓库库位</span>
                  <div
                    style="
                      display: flex;
                      align-items: center;
                      width: calc(100% - 60px);
                    "
                  >
                    <van-field
                      v-model="item.warehouseName"
                      readonly
                      placeholder="入库库位"
                      :disabled="timeIn"
                      @click="changeMerWare(index)"
                    />
                    <van-field
                      v-model="item.inventoryUnitName"
                      readonly
                      placeholder="库位单元"
                      :disabled="timeIn"
                      @click="chooseMerUnit(index)"
                    />
                  </div>
                </div>
                <van-icon
                  name="browsing-history-o"
                  @click="changeMaterailWare(index)"
                />
              </div>
              <p
                v-if="timeIn && !changeIn"
                style="color: #da3231; padding: 4px 0"
              >
                {{ item.remark }}
              </p>
            </div>
            <div
              style="display: flex; flex-direction: column"
              v-show="!changeIn"
            >
              <!-- <van-button
                style="color: #da3231; border: none"
                v-if="
                  materialList.length !== materialColumns.length &&
                  materialList.length - 1 == index &&
                  !timeIn
                "
                icon="plus"
                @click="addMaterialList('0')"
              >
                增加物料
              </van-button> -->
            </div>
            <div class="delete-icon">
              <span
                style="color: #da3231; cursor: pointer"
                v-if="materialList.length !== 1"
                @click="delMaterials(index)"
              >
                删除
              </span>
            </div>
          </div>
        </div>
      </div>
      <van-button
        round
        v-if="!timeIn && !changeIn"
        type="primary"
        :disabled="materialList.length > 0 ? false : true"
        block
        @click="handleFeed"
        >投料</van-button
      >
      <van-button
        round
        v-else-if="!timeIn && changeIn"
        type="primary"
        block
        @click="handleFeed"
        >确认修改</van-button
      >
      <SecondSureButton
        v-else-if="timeIn && !changeIn"
        v-model="timeIn"
        ref="secondSureRef"
        @clickSureButton="taskComplete('1')"
      />
      <SecondSureButton
        v-else
        v-model="timeIn"
        ref="secondSureRef"
        @clickSureButton="cancelChange"
      />
    </van-popup>

    <!-- 临时投料 -->
    <van-popup
      v-model:show="sudFeedShow"
      round
      :style="{ padding: '40px', 'min-width': '380px' }"
      @closed="timeIn = false"
    >
      <div class="pop-content">
        <h3 style="text-align: center">临时投料</h3>
        <!-- <van-button @click="testMaterial">点击</van-button>
        <van-button @click="readCARD('LC.M01001')">点击库位</van-button> -->
        <van-divider v-if="!changeIn">扫码添加物料 </van-divider>
        <div class="content">
          <div
            class="item-content"
            v-for="(item, index) in sudMaterialList"
            :key="index"
          >
            <p class="item-title">{{ "物料" + (index + 1) }}</p>
            <div>
              <van-field
                v-model="item.materialSequence"
                is-link
                readonly
                label="投料物料"
                :disabled="timeIn"
                @click="chooseSudMaterial(index)"
              />
              <van-field
                label="投料数量"
                v-model="item.qty"
                :disabled="timeIn"
                type="number"
              />
              <div class="wareFind">
                <div class="intoStorage-content-item">
                  <span class="label">仓库库位</span>
                  <div
                    style="
                      display: flex;
                      align-items: center;
                      width: calc(100% - 60px);
                    "
                  >
                    <van-field
                      v-model="item.warehouseName"
                      readonly
                      placeholder="入库库位"
                      :disabled="timeIn"
                      @click="changeMerWare(index)"
                    />
                    <van-field
                      v-model="item.inventoryUnitName"
                      readonly
                      placeholder="库位单元"
                      :disabled="timeIn"
                      @click="chooseMerUnit(index)"
                    />
                  </div>
                </div>
                <van-icon
                  name="browsing-history-o"
                  @click="changeMaterailWare(index)"
                />
              </div>
              <p
                v-if="timeIn && !changeIn"
                style="color: #da3231; padding: 4px 0"
              >
                {{ item.remark }}
              </p>
            </div>
            <!-- <div style="display: flex; flex-direction: column">
              <van-button
                style="color: #da3231; border: none"
                v-if="
                  sudMaterialList.length !== materialColumns.length &&
                  sudMaterialList.length - 1 == index &&
                  !timeIn
                "
                icon="plus"
                @click="addMaterialList('1')"
              >
                增加物料
              </van-button>
            </div> -->
            <div class="delete-icon">
              <span
                style="color: #da3231; cursor: pointer"
                v-if="sudMaterialList.length !== 1"
                @click="delMaterials(index)"
              >
                删除
              </span>
            </div>
          </div>
        </div>
      </div>
      <van-button
        round
        v-if="!timeIn"
        type="primary"
        block
        @click="handleFeed"
        :disabled="sudMaterialList.length == 0"
        >投料</van-button
      >
      <SecondSureButton
        v-model="timeIn"
        ref="secondSureRef"
        @clickSureButton="sudMTComplete"
        v-else
      />
    </van-popup>

    <!-- 报工 -->
    <van-popup
      v-model:show="finishShow"
      round
      :style="{ padding: '40px' }"
      @closed="timeIn = false"
    >
      <span style="padding-left: 18px">总投料量：</span
      ><span style="margin-bottom: 24px; color: #173692">{{ +feedSum }}</span>
      <van-swipe
        indicator-color="#959595"
        style="width: 250px"
        ref="productlSwiperRef"
      >
        <van-swipe-item
          v-for="(item, index) in productlList"
          :key="index"
          class="swipe-item"
        >
          <div>
            <van-field
              v-model="item.maName"
              is-link
              readonly
              label="报工产品"
              :disabled="timeIn"
              @click="chooseProduct(index)"
            />
            <van-field
              label="报工数量"
              v-model="item.qty"
              type="number"
              :disabled="timeIn"
            />
          </div>
          <div style="display: flex; flex-direction: column">
            <van-icon
              name="plus"
              size="20"
              @click="addProductlList"
              style="margin-bottom: 16px"
              v-if="
                productlList.length !== productColumns.length &&
                productlList.length - 1 == index
              "
            />
            <van-icon
              name="delete-o"
              size="20"
              v-if="productlList.length !== 1"
              @click="productlList.splice(index, 1)"
            />
          </div>
        </van-swipe-item>
      </van-swipe>
      <van-button
        round
        v-if="!timeIn"
        type="primary"
        block
        @click="handleReportWork"
      >
        报工
      </van-button>
      <SecondSureButton
        v-model="timeIn"
        ref="secondSureRef"
        @clickSureButton="handleOperation"
        v-else
      />
    </van-popup>

    <!-- 入库 -->
    <van-popup
      v-model:show="unitShow"
      round
      :style="{ padding: '40px', width: '500px' }"
      @closed="timeIn = false"
    >
      <van-tabs v-model:active="activeProduct">
        <van-tab v-for="(item, index) in productList" :key="index">
          <template #title>
            <van-badge dot v-if="surplusList[index] !== '0.00'">
              <span>{{ item.maName }}</span>
            </van-badge>
            <span v-else>{{ item.maName }}</span>
          </template>
          <div>
            <span>剩余数量：{{ `${surplusList[index]}${item.stu}` }}</span>
          </div>
          <div class="content">
            <div
              class="intoStorage-content"
              v-for="(obj, key) in item.trkList"
              :key="key"
            >
              <div class="intoStorage-content-left">
                <div
                  class="intoStorage-content-item"
                  style="background-color: #f7f8fa"
                >
                  <span>{{ `库位${key + 1}` }}</span>
                  <div
                    v-show="item.trkList.length > 1"
                    @click="item.trkList.splice(key, 1)"
                    style="color: #ee0a24"
                  >
                    删除
                  </div>
                </div>
                <div
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding-top: 8px;
                  "
                >
                  <div>
                    <ButtonRadio :options="typeOptions" v-model="obj.type" />
                  </div>
                </div>
                <div class="intoStorage-content-item">
                  <span class="label">入库数量</span>
                  <div
                    style="
                      width: calc(100% - 60px);
                      display: flex;
                      align-items: center;
                    "
                  >
                    <van-field
                      v-model="obj.qtyStu"
                      type="number"
                      placeholder="请输入"
                      style="width: 50%"
                      :disabled="timeIn"
                      v-if="obj.type === 1"
                    />
                    <van-field
                      v-model="obj.qty"
                      type="number"
                      placeholder="请输入"
                      style="width: 50%"
                      :disabled="timeIn"
                      v-else
                    />
                    <div v-if="obj.type === 1" style="width: ">
                      {{ obj.stu }}
                    </div>
                    <van-field
                      readonly
                      v-model="obj.pcuName"
                      placeholder="请选择"
                      :disabled="timeIn"
                      @click="
                        chooseUnitPacking(item.packageUnitList, { index, key })
                      "
                      v-else
                    />
                  </div>
                </div>
                <div class="intoStorage-content-item">
                  <span class="label">仓库库位</span>
                  <div
                    style="
                      display: flex;
                      align-items: center;
                      width: calc(100% - 60px);
                    "
                  >
                    <van-field
                      v-model="obj.warehouseName"
                      readonly
                      placeholder="入库库位"
                      :disabled="timeIn"
                      @click="changeWare({ index, key })"
                    />
                    <van-field
                      v-model="obj.inventoryUnitName"
                      readonly
                      placeholder="库位单元"
                      :disabled="timeIn"
                      @click="chooseUnit({ index, key })"
                    />
                  </div>
                </div>
              </div>
              <div
                class="addButton"
                @click="addStorageInformation(key + 1, item)"
                v-if="item.trkList.length - 1 === key && !timeIn"
              >
                增加库位
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
      <van-button
        round
        v-if="!timeIn"
        type="primary"
        block
        @click="handleIntoStorage"
      >
        入库
      </van-button>
      <SecondSureButton
        v-model="timeIn"
        ref="secondSureRef"
        @clickSureButton="wareOperation"
        v-else
      />
    </van-popup>

    <!-- 投料弹框 -->
    <van-popup
      v-model:show="materialShowPicker"
      round
      position="bottom"
      @closed="timeIn = false"
    >
      <van-picker
        :columns="materialColumns"
        @cancel="materialShowPicker = false"
        @confirm="confirmMaterial"
        :columns-field-names="{ value: 'maId' }"
      >
        <template #option="option">
          <div>
            {{
              detailsData.itemDisplay
                ? option[detailsData.itemDisplay]
                  ? option[detailsData.itemDisplay]
                  : option.maName
                : option.maName
            }}
          </div>
        </template>
      </van-picker>
    </van-popup>

    <!-- 临时投料弹框 -->
    <van-popup
      v-model:show="sudMaterialShowPicker"
      round
      position="bottom"
      @closed="timeIn = false"
    >
      <van-picker
        :columns="materialColumns"
        @cancel="sudMaterialShowPicker = false"
        @confirm="confirmSudMaterial"
        :columns-field-names="{ value: 'maId' }"
      >
        <template #option="option">
          <div>
            {{
              detailsData.itemDisplay
                ? option[detailsData.itemDisplay]
                  ? option[detailsData.itemDisplay]
                  : option.maName
                : option.maName
            }}
          </div>
        </template>
      </van-picker>
    </van-popup>

    <!-- 报工/入库产品 -->
    <van-popup v-model:show="productShowPicker" round position="bottom">
      <van-picker
        :columns="productColumns"
        @cancel="productShowPicker = false"
        @confirm="confirmProduct"
        :columns-field-names="{ text: 'maName', value: 'maId' }"
      />
    </van-popup>

    <!-- 请检 -->
    <van-popup
      v-model:show="checkShow"
      round
      :style="{ padding: '40px' }"
      @closed="timeIn = false"
    >
      <div>
        <van-field
          v-model="sectionData.name"
          is-link
          readonly
          label="化验部门"
          @click="sectionShow = true"
          :disabled="timeIn"
        />
        <van-field
          v-model="samplingPointData.name"
          is-link
          readonly
          label="采样点"
          :disabled="timeIn"
          @click="pointPicker = true"
        />
      </div>
      <van-button round v-if="!timeIn" type="primary" block @click="handleCheck"
        >请检</van-button
      >
      <SecondSureButton
        v-model="timeIn"
        ref="secondSureRef"
        @clickSureButton="handleSureCheck"
        v-else
      />
    </van-popup>

    <!-- 采样点 -->
    <van-popup v-model:show="pointPicker" round position="bottom">
      <van-picker
        :columns="pointColumn"
        @cancel="pointPicker = false"
        @confirm="confirPoint"
        :columns-field-names="{
          text: 'samplePointName',
          value: 'samplePointId',
        }"
      />
    </van-popup>

    <!-- 化验部门 -->
    <van-popup v-model:show="sectionShow" round position="bottom">
      <van-picker
        title="请选择化验部门"
        :columns="sectionOptions"
        @cancel="sectionShow = false"
        @confirm="confirmSection"
        :columns-field-names="{
          text: 'orgName',
          value: 'orgId',
        }"
      />
    </van-popup>

    <!-- 物料仓库 -->
    <van-popup v-model:show="merWareShowPicker" round position="bottom">
      <van-picker
        :columns="wareColumns"
        @cancel="merWareShowPicker = false"
        @confirm="confirmMerWare"
        :columns-field-names="{ text: 'warehouseName', value: 'warehouseId' }"
      />
    </van-popup>

    <!-- 物料库存单元 -->
    <van-popup v-model:show="merUnitShowPicker" round position="bottom">
      <van-picker
        :columns="unitColumns"
        @cancel="merUnitShowPicker = false"
        @confirm="confirmMerUnit"
        :columns-field-names="{
          text: 'inventoryUnitName',
          value: 'inventoryUnitId',
        }"
      />
    </van-popup>

    <!-- 仓库 -->
    <van-popup v-model:show="wareShowPicker" round position="bottom">
      <van-picker
        :columns="wareColumns"
        @cancel="wareShowPicker = false"
        @confirm="confirmWare"
        :columns-field-names="{ text: 'warehouseName', value: 'warehouseId' }"
      />
    </van-popup>

    <!-- 库存单元 -->
    <van-popup v-model:show="unitShowPicker" round position="bottom">
      <van-picker
        :columns="unitColumns"
        @cancel="unitShowPicker = false"
        @confirm="confirmUnit"
        :columns-field-names="{
          text: 'inventoryUnitName',
          value: 'inventoryUnitId',
        }"
      />
    </van-popup>

    <!-- 包装单位 -->
    <van-popup v-model:show="unitPackingPicker" round position="bottom">
      <van-picker
        :columns="unitPackingColumns"
        @cancel="unitPackingPicker = false"
        @confirm="confirmUnitPacking"
        :columns-field-names="{ text: 'pcuName', value: 'pcuCode' }"
      />
    </van-popup>

    <!-- 混批 -->
    <BatchModal
      ref="batchRef"
      v-model="showBatch"
      :orderId="mfgId"
      @refesh="getDetail"
    />

    <!-- 参数输入 -->
    <ParamsInput
      v-model="paramsInputShow"
      :paramsData="paramsData"
      @confirmParams="confirmParams"
    />
  </div>
</template>

<script setup lang="ts">
import { nextTick, watch, ref } from "vue";
import { FlowLineItem } from "../../types/production";
import { showSuccessToast, showFailToast, showToast } from "vant";
import SecondSureButton from "./SecondSureButton.vue";
import BatchInformation from "./BatchInformation.vue";
import BatchModal from "./BatchModal.vue";
import { useButtonListStore, useWebsocketStore } from "@/store";
import dayjs from "dayjs";
import ButtonRadio from "../../../components/ButtonRadio.vue";
import Mytable from "../../../components/Mytable.vue";
import ParamsInput from "./ParamsInput.vue";
import { parseString } from "../../../utils/transformJson";
import useDictionary from "@/hooks/useDictionary.ts";

const { dictionaryList, getDictionaryList } =
useDictionary();
const buttonStore = useButtonListStore();
const route = useRoute();
const router = useRouter();
const { proxy } = getCurrentInstance();
const detailsData = reactive<any>({}); //详情数据
const operateListData = ref<any[]>([]); //工序列表
const activeTab = ref<any>(0); //工序ID
const mfgId = ref(route.params.id); //工单id
const chooseTabData = ref<any>(null); //当前工序的详情
const processList = ref<FlowLineItem[]>([]); //工序步骤列表
let currentTask = ref<any>({}); // 工序步骤列表最后一项
const activeStep = ref(0); // 工序当前步骤
const sureOperationLoading = ref<boolean>(false); //节流加载状态
const productionShow = ref<boolean>(false); //生产操作
const feedShow = ref<boolean>(false); //投料
const sudFeedShow = ref<boolean>(false); //临时投料
const finishShow = ref<boolean>(false); //报工
const unitShow = ref<boolean>(false); //入库
const timeIn = ref<boolean>(false); //二次确认倒计时
const materialShowPicker = ref<boolean>(false);
const sudMaterialShowPicker = ref<boolean>(false);
const productShowPicker = ref<boolean>(false);
const checkShow = ref<boolean>(false);
const wareShowPicker = ref<boolean>(false);
const unitShowPicker = ref<boolean>(false);
const merWarePickerType = ref<number>(0); //1物料投料选择仓库 2临时投料选择仓库
const merWareShowPicker = ref<boolean>(false);
const merUnitShowPicker = ref<boolean>(false);
const unitPackingPicker = ref<boolean>(false); // 包装单位
const pointPicker = ref<boolean>(false);
const sectionShow = ref<boolean>(false);
const materialIndex = ref<number>(0);
const sudMaterialIndex = ref<number>(0);
const productIndex = ref<number>();
let unitPackingIndex = reactive({
  index: 0,
  key: 0,
});
const materialList = ref<any[]>([]);
const sudMaterialList = ref<any[]>([]);
const productlList = ref<any[]>([]);
const productList = ref<any[]>([]);
const sectionData = reactive<any>({
  id: "",
  name: "",
});
const samplingPointData = reactive<any>({
  id: "",
  name: "",
});
const materialColumns = ref<any[]>([]);
const productColumns = ref<any[]>([]);
const wareColumns = ref<any[]>([]);
const unitColumns = ref<any[]>([]);
const unitPackingColumns = ref<any[]>([]);
const pointColumn = ref<any[]>([]);
const materialSwiperRef: Ref = ref<any>(null); // 投料swipe
const productlSwiperRef: Ref = ref<any>(null); // 报工swipe
const buttonList = ref<any>([]); //操作按钮列表
const activeProduct = ref<number>(0);
const typeOptions = [
  { label: "计量单位", value: 1 },
  { label: "包装单位", value: 2 },
];
const showBatch = ref<boolean>(false); // 混批弹框
const batchRef: Ref = ref(null);
const chooseDeviceId = ref<string | number>(""); // 选择反应釜id -1为混批
const sectionOptions = ref<any[]>([]);
const secondSureRef: Ref = ref(null);
const batchDetail = ref<any>({}); // 混批详情
const batchInformationData = ref<any>(null);
const surplusList = ref<any[]>([]);
const trkList = ref<any[]>([]);
const chooseOrderName = ref<string>("");
const feedSum = ref<number>(0);
const buttonGroupState = ref<any>(null);
const buttonType: any = {
  0: [
    {
      name: "开始生产",
      click: startProduction,
    },
  ],
  2: [
    {
      name: "混批",
      click: () => {
        showBatch.value = true;
        nextTick(() => {
          batchRef.value.getList();
        });
      },
    },
    {
      name: "生产入库",
      click: () => {
        getMfgProductByTrk();
        unitShow.value = true;
      },
    },
  ],
  3: [],
};
const showBom = ref<boolean>(false);

const buttonStatus: any = {
  1: [
    {
      name: "临时加料",
      click: () => {
        getMaterialList();
        sudFeedShow.value = true;
        sudMaterialList.value = [];
      },
    },
  ],
  2: [
    {
      name: "确认操作",
      click: () => {
        sureOperationLoading.value = false;
        productionShow.value = true;
      },
      // click: confirmOperation
    },
    {
      name: "临时加料",
      click: () => {
        getMaterialList();
        sudFeedShow.value = true;
        sudMaterialList.value = [];
      },
    },
  ],
  3: [], // 任务结束
  4: [
    {
      name: "过程请检",
      click: () => {
        getPointList();
        getSectionList();
        checkShow.value = true;
      },
    },
  ],
  5: [
    {
      name: "产品终检",
      click: () => {
        getPointList();
        getSectionList();
        checkShow.value = true;
      },
    },
  ],
  6: [
    {
      name: "输入参数",
      click: () => {
        paramsData.value = parseString(
          processList.value[activeStep.value][0]?.customMap?.operateParamInput
        );
        paramsInputShow.value = true;
      },
    },
  ],
  default: [
    {
      name: "生产报工",
      click: () => {
        getProductList();
        finishShow.value = true;
        productlList.value = [
          {
            maName: "",
            maId: null,
            unit: null,
            remark: null,
            mfgId: mfgId.value,
            qty: null,
          },
        ];
        sureOperationLoading.value = false;
      },
    },
    {
      name: "临时加料",
      click: () => {
        getMaterialList();
        sudFeedShow.value = true;
        sudMaterialList.value = [];
      },
    },
  ],
};

const batchButton = [
  {
    name: "化验请检",
    click: () => {
      getPointList();
      getSectionList();
      checkShow.value = true;
    },
  },
  {
    name: "生产入库",
    click: () => {
      getMfgProductByTrk();
      unitShow.value = true;
    },
  },
];
const changeIn = ref(false); //修改数量状态
// 选中节点的index
const taskIndex = ref<number>(0);
const bomColumns = ref<any[]>([
  { label: "物料代码", prop: "materialSequence", sortable: true, width: "20%" },
  { label: "物料名称", prop: "maName", sortable: true, width: "15%" },
  { label: "物料编码", prop: "maCode", sortable: true, width: "15%" },
  { label: "批次", prop: "lot", sortable: true, width: "20%" },
  { label: "计划数量", prop: "extQty", width: "10%" },
  { label: "已投数量", prop: "cplQty", width: "10%" },
  { label: "备注", prop: "remark", width: "10%" },
]);

// 参数输入
const paramsInputShow = ref<boolean>(false);
const paramsData = ref<any>(null);
const websocketStore = useWebsocketStore();

const testMaterial = () => {
  readCARD("MT.RM200392@@LT.LC10124010194");
  console.log("getFeedMeterial", taskIndex.value, currentTask.value);
};
// 点击修改投料数量
const openChangeMa = (ma: any) => {
  if (chooseTabData.value.operateStatus == 2) {
    changeIn.value = true;
    getMaterialList();
    feedShow.value = true;
    materialList.value = [];
    materialList.value.push(ma);
  }
  // 添加判断
};

// 获取工单详情
const getDetail = async () => {
  const res = await proxy.$api.productionOperations.productionOrderDetail({
    orderId: route.params.id,
  });
  if (res.code == 200) {
    for (let k in res.data) {
      detailsData[k] = res.data[k];
    }
    operateListData.value = res.data.operateList;
    const index = res.data.operateList.findIndex(
      (item: any) => item.operateStatus == 2
    );
    if (res.data.operateList.length) {
      const { operateId, procInsId } =
        res.data.operateList[index > 0 ? index : 0];
      activeTab.value = operateId;
      chooseTabData.value = operateListData.value.find(
        (item: any) => item.operateId === operateId
      );
      getTaskDetail(procInsId);
    }
    websocketStore.websocket.addEventListener("message", function (event: any) {
      const webcocketData = JSON.parse(event.data);
      if (webcocketData.type === "mfgOrder") {
        taskIndex.value = 0;
        for (let key in webcocketData.data) {
          if (
            operateListData.value.find((item: any) => item.operateId == key)
          ) {
            normalTileLine(webcocketData.data[key]);
          }
          //   if (key == 'order') {
          //   if (webcocketData.data.order.status === 3) chooseDeviceInterface();
          // else updateButton(webcocketData.data.order);
          //}
        }
      }
    });
    getWebScoketDatabase(route.params.id);
    getMaterialList();
  }
};

//  获取 webScoket
function getWebScoketDatabase(orderId: any) {
  if (websocketStore.websocket.readyState === 1) {
    sendMessage(orderId);
  } else if (websocketStore.websocket.readyState === 0) {
    setTimeout(() => {
      sendMessage(orderId);
    }, 300);
  }
}

function sendMessage(orderId: number) {
  websocketStore.websocket.send(
    JSON.stringify({
      type: "mfgOrder",
      operation: "open", // open开启 close关闭
      data: orderId,
    })
  );
}
// 获取工序列表
const getTaskDetail = async (procInsId: string) => {
  if (!procInsId) {
    processList.value = [];
    buttonStore.setButtonList(buttonType[0]);
    return;
  }
  const res = await proxy.$api.productionOperations.processDetail({
    procInsId,
    mfgId: mfgId.value,
  });
  if (res.code == 200) {
    // 是否存在未完成的工序
    const isFinished = operateListData.value.find(
      (item: any) => item.operateStatus !== 3
    );
    processList.value = res.data || [];
    if (chooseTabData.value.operateStatus == 3 && isFinished) {
      buttonStore.setButtonList(buttonStatus[1]);
    } else {
      normalTileLine(res.data);
    }
    // 根据timeline设定节点
  }
};
function normalTileLine(data: any) {
  // operateStatus:1待开工,2正常进行,3已完工，只显示临时投料
  if (
    data.find((item: any) =>
      item.isCurrent ? item.isCurrent === true : item[0]?.isCurrent === true
    )
  ) {
    currentTask.value = data.find((item: any) =>
      item.isCurrent ? item.isCurrent === true : item[0]?.isCurrent === true
    );
  } else {
    currentTask.value = data[data.length - 1];
  }
  activeStep.value = data.findIndex((item: any) =>
    item.isCurrent ? item.isCurrent === true : item[0]?.isCurrent === true
  );
  changeButtonStatus(detailsData, currentTask.value);
}

const handelChangeTab = (operateId: number) => {
  // 当前工序的详情
  chooseTabData.value = operateListData.value.find(
    (item) => item.operateId === operateId
  );
  getTaskDetail(chooseTabData.value.procInsId);
};

// 获取混批详情
const getMixDetail = async (id: any, name: string) => {
  mfgId.value = id;
  chooseOrderName.value = name;
  const res = await proxy.$api.productionOperations.getMfgBatch({
    id,
  });
  if (res?.code === 200) {
    for (let k in detailsData) {
      detailsData[k] = "";
    }
    for (let k in res.data) {
      if (k !== "workOrderVOList") batchDetail.value[k] = res.data[k];
    }

    batchInformationData.value = res.data.workOrderVOList;
    buttonStore.setButtonList(batchButton);
  }
};

// 获取工单构成信息(投料物料)
const getMaterialList = async () => {
  const res = await proxy.$api.productionOperations.getMfgBom({
    mfgId: mfgId.value,
  });
  if (res?.code == 200) materialColumns.value = res.data;
};

// 获取工单产品信息(投料物料)
const getProductList = async () => {
  const res = await proxy.$api.productionOperations.getMfgProduct({
    mfgId: mfgId.value,
  });
  if (res?.code == 200) productColumns.value = res.data;
  feedSum.value = res.feedSum;
};

// 开始生产
async function startProduction() {
  const res = await proxy.$api.productionOperations.startWorkOrder({
    orderId: mfgId.value,
    operateId: activeTab.value,
  });
  if (res.code == 200) {
    showSuccessToast(res.message);
    getDetail();
  }
}

// 临时投料
const sudMTComplete = async (data?: string) => {
  sureOperationLoading.value = true;
  const sendData: any = {
    taskId: currentTask.value?.taskId
      ? currentTask.value?.taskId
      : currentTask.value[taskIndex.value]?.taskId,
    trkList: sudMaterialList.value,
    mfgId: detailsData.mfgId,
    procInsId: chooseTabData.value.procInsId,
    operateId: activeTab.value,
  };
  const res = await proxy.$api.productionOperations.sudProcessComplete(
    sendData
  );
  if (res?.code == 200) {
    if (data) feedShow.value = false;
    sudFeedShow.value = false;
    showSuccessToast(res.message);
    getDetail();
    timeIn.value = false;
    sureOperationLoading.value = false;
  } else if (res.code == 207) {
    // 获取有问题的物料列表
    const problemMaterials = JSON.parse(res.msg);
    // 根据 maId 匹配并补充原始物料信息
    sudMaterialList.value = problemMaterials.map((problemItem: any) => {
      const originalItem = sudMaterialList.value.find(
        (item: any) => item.maId === problemItem.maId
      );
      return {
        ...originalItem, // 保留原始物料信息
        ...problemItem, // 用问题物料信息覆盖
      };
    });
    getDetail();
  } else sureOperationLoading.value = false;
  secondSureRef?.value?.changeShow();
};

// 投料确认
const materailComplete = async (data?: string) => {
  sureOperationLoading.value = true;
  const sendData: any = {
    taskId: currentTask.value?.taskId
      ? currentTask.value?.taskId
      : currentTask.value[taskIndex.value]?.taskId,
    trkList: materialList.value,
    mfgId: detailsData.mfgId,
    procInsId: chooseTabData.value.procInsId,
    operateId: activeTab.value,
  };

  const res = await proxy.$api.productionOperations.sudProcessComplete(
    sendData
  );

  if (res?.code == 200) {
    if (data) feedShow.value = false;
    feedShow.value = false;
    showSuccessToast(res.message);
    getDetail();
    timeIn.value = false;
    sureOperationLoading.value = false;
    showToast("投料成功！");
    getMaterialList();
  } else if (res.code == 207) {
    // 获取有问题的物料列表
    const problemMaterials = JSON.parse(res.msg);
    // 根据 maId 匹配并补充原始物料信息
    materialList.value = problemMaterials.map((problemItem: any) => {
      const originalItem = materialList.value.find(
        (item: any) => item.maId === problemItem.maId
      );
      return {
        ...originalItem, // 保留原始物料信息
        ...problemItem, // 用问题物料信息覆盖
      };
    });
    getDetail();
  } else {
    secondSureRef?.value?.changeShow();
    sureOperationLoading.value = false;
  }
};

// 确认修改
const cancelChange = async () => {
  sureOperationLoading.value = true;
  const res = await proxy.$api.productionOperations.changePickNum({
    mfgTrkId: materialList.value[0].mfgTrkId,
    qty: materialList.value[0].qty,
  });
  if (res?.code == 200) {
    feedShow.value = false;
    productionShow.value = false;
    showSuccessToast(res.message);
    changeIn.value = false;
    sureOperationLoading.value = false;
  } else sureOperationLoading.value = false;
  changeIn.value = false;
  secondSureRef?.value?.changeShow();
};

// 确认操作
const taskComplete = async (data?: string) => {
  sureOperationLoading.value = true;
  const sendData: any = {
    taskId: currentTask.value?.taskId
      ? currentTask.value?.taskId
      : currentTask.value[taskIndex.value]?.taskId,
    procInsId: chooseTabData.value.procInsId,
    operateId: activeTab.value,
  };
  if (data === "1") {
    sendData.variables = {};
    const taskForm = {
      trkList: materialList.value,
      mfgId: detailsData.mfgId,
    };
    sendData.variables.taskForm = JSON.stringify(taskForm);
  }
  const res = await proxy.$api.productionOperations.processComplete(sendData);
  if (res?.code == 200) {
    if (data) feedShow.value = false;
    productionShow.value = false;
    showSuccessToast(res.message);
    getDetail();
    timeIn.value = false;
    sureOperationLoading.value = false;
  } else if (res.code == 207) {
    // 获取有问题的物料列表
    const problemMaterials = JSON.parse(res.msg);
    // 根据 maId 匹配并补充原始物料信息
    materialList.value = problemMaterials.map((problemItem: any) => {
      const originalItem = materialList.value.find(
        (item: any) => item.maId === problemItem.maId
      );
      return {
        ...originalItem, // 保留原始物料信息
        ...problemItem, // 用问题物料信息覆盖
      };
    });
    getDetail();
  } else sureOperationLoading.value = false;
  secondSureRef?.value?.changeShow();
};

// 报工操作
async function handleOperation() {
  const sendData = {
    trkList: productlList.value,
    mfgId: detailsData.mfgId,
  };
  const res = await proxy.$api.productionOperations.bomComplete(sendData);
  if (res?.code == 200) {
    finishShow.value = false;
    timeIn.value = false;
    showSuccessToast(res.message);
    getDetail();
  }
  secondSureRef?.value?.changeShow();
}

// 巡检操作
async function handleSureCheck() {
  let sendData: any;

  if ((chooseDeviceId.value as number) > -1) {
    sendData = {
      taskId: currentTask.value?.taskId
        ? currentTask.value?.taskId
        : currentTask.value[taskIndex.value]?.taskId,
      procInsId: chooseTabData.value.procInsId,
      system: "inner",
      params: {
        operateId: activeTab.value,
        samplePointId: samplingPointData.id,
        orgId: sectionData.id,
      },
    };
  } else {
    sendData = {
      system: "innerBatch",
      params: {
        samplePointId: samplingPointData.id,
        orgId: sectionData.id,
      },
      batchId: batchDetail.value.batchId,
    };
  }
  const res = await proxy.$api.productionOperations.checkRequest(sendData);
  if (res?.code === 200) {
    timeIn.value = false;
    showSuccessToast(res.msg);
    if ((chooseDeviceId.value as number) > 0) {
      getDetail();
    } else getMixList();
    sectionData.id = "";
    sectionData.name = "";
    samplingPointData.id = "";
    samplingPointData.name = "";
    checkShow.value = false;
  }
  secondSureRef?.value?.changeShow();
}

// 入库操作
async function wareOperation() {
  let trkList: any = [];
  productList.value.map((item) => {
    item.trkList.map((obj: any) => {
      if (obj.type === 1) {
        // 计量单位
        obj.pcu = "";
      } else if (obj.type === 2) {
        // 包装单位
        obj.qtyStu = null;
      }
    });

    trkList = trkList.concat(item.trkList);
  });

  const sendData: any = {
    trkList,
    mfgId: detailsData.mfgId,
  };
  if ((chooseDeviceId.value as number) < 0) {
    sendData.batchId = batchDetail.value.batchId;
  }
  const res = await proxy.$api.productionOperations.productionReporting(
    sendData
  );
  if (res?.code == 200) {
    unitShow.value = false;
    showSuccessToast(res.message);
    if ((chooseDeviceId.value as number) > 0) {
      getDetail();
    } else getMixList();
  }

  secondSureRef?.value?.changeShow();
}

// 点击报工
const handleReportWork = () => {
  const isFinish = productlList.value.find((item) => {
    return !(item.maName && item.qty && item.qty > 0);
  });
  if (isFinish) return showToast("请填写正确生产报工信息");
  timeIn.value = true;
};

// 点击请检
const handleCheck = () => {
  if (
    sectionData.id &&
    sectionData.name &&
    samplingPointData.id &&
    samplingPointData.name
  )
    timeIn.value = true;
  else showToast("请填写正确的请检内容");
};

// 点击投料(验证是否符合)
const handleFeed = () => {
  // 遍历 materialList 并处理 remark
  materialList.value = materialList.value.map((item) => {
    return {
      ...item,
      remark: null, // 初始化或删除 remark
    };
  });
  // 验证是否存在未填写的物料信息
  const isFinish = materialList.value.find((item) => {
    return !(item.maName && item.qty && item.qty > 0);
  });

  if (isFinish) {
    return showToast("请填写正确投料信息");
  }
  // 如果验证通过，则执行其他逻辑
  timeIn.value = true;
};

// 点击入库按钮(验证是否符合)
const handleIntoStorage = () => {
  const isFinish = productList.value.find((item: any) => {
    return item.trkList.find((obj: any) => {
      if (obj.type === 1) {
        return !(obj.qtyStu && obj.qtyStu > 0 && obj.warehouseName);
      } else {
        return !(obj.qty && obj.qty > 0 && obj.pcuName && obj.warehouseName);
      }
    });
  });
  if (isFinish || surplusList.value[activeProduct.value] < 0)
    return showToast("请填写正确入库信息");
  timeIn.value = true;
};

// 添加投料物料
const addMaterialList = (data: string) => {
  if (data === "0") {
    materialList.value.push({
      maName: "",
      maId: null,
      unit: null,
      remark: null,
      qty: null,
    });
    materialSwiperRef.value.next();
  } else {
    sudMaterialList.value.push({
      maName: "",
      maId: null,
      unit: null,
      remark: null,
      qty: null,
    });
    materialSwiperRef.value.next();
  }
};

// 添加报工
const addProductlList = () => {
  productlList.value.push({
    maName: "",
    maId: null,
    unit: null,
    remark: null,
    mfgId: mfgId.value,
    qty: null,
  });
  productlSwiperRef.value.next();
};

const delMaterials=(index:number)=>{
  if(sudFeedShow.value==true){
    sudMaterialList.value.splice(index, 1);
    sudMaterialIndex.value=sudMaterialList.value.length-1;
  }else{
    materialList.value.splice(index, 1);
    materialIndex.value=materialList.value.length-1;
  }
}

// 获取二维码信息后解析物料信息
const getFeedMeterial = async (item: string) => {
  let res = await proxy.$api.productionOperations.scanFeed({
    mfgId: mfgId.value,
    CodeJson: item,
  });
  if (res.code == 200) {
    // 添加临时投料的判断
    if (sudFeedShow.value) {
      sudMaterialList.value.push({
        maId: res.data.maId,
        unit: res.data.stu,
        mfgIoId: res.data.mfgIoId,
        itemDisplay: res.data.itemDisplay,
        materialSequence: res.data.materialSequence,
        remark: null,
        qty: res.data.leftQty,
        lot: res.data.lot,
        maName: res.data.maName,
        warehouseName: null,
        warehouseId: null,
        inventoryUnitName: null,
        inventoryUnitId: null,
      });
      sudMaterialIndex.value = sudMaterialList.value.length - 1;
    } else {
      // 生产投料
      let materialIdList = [];
      currentTask.value.forEach((item: any) => {
        const xmlSetting = parseString(item.customMap.feedData);
        if (xmlSetting.materialId) materialIdList.push(xmlSetting.materialId);
      });
      const index = materialIdList.indexOf(String(res.data.maId));
      if (index !== -1) {
        feedShow.value = true;
        materialList.value.push({
          maId: res.data.maId,
          unit: res.data.stu,
          mfgIoId: res.data.mfgIoId,
          itemDisplay: res.data.itemDisplay,
          materialSequence: res.data.materialSequence,
          remark: null,
          qty: res.data.leftQty,
          lot: res.data.lot,
          maName: res.data.maName,
          warehouseName: null,
          warehouseId: null,
          inventoryUnitName: null,
          inventoryUnitId: null,
        });
        materialIndex.value = materialList.value.length - 1;
        taskIndex.value = index;
      } else {
        showFailToast("物料匹配失败！");
        feedShow.value = false;
        taskIndex.value = 0;
      }
    }
  }
};

// 点击仓库扫码图标
const changeMaterailWare = (idx: number) => {
  if (sudFeedShow.value) {
    sudMaterialIndex.value = idx;
  } else {
    materialIndex.value = idx;
  }
};

// 获取二维码信息后解析仓库信息
const getMeterialWare = async (item: string) => {
  console.log('getMeterialWare');
  let res = await proxy.$api.productionOperations.findWare({
    CodeJson: item,
  });
  if ((res.code = 200)) {
    if (sudFeedShow.value) {
      sudMaterialList.value[sudMaterialIndex.value as number].warehouseName =
        res.data.wareHouseName;
      sudMaterialList.value[sudMaterialIndex.value as number].warehouseId =
        res.data.wareHouseId;
      sudMaterialList.value[
        sudMaterialIndex.value as number
      ].inventoryUnitName = res.data.inventoryUnitName;
      sudMaterialList.value[sudMaterialIndex.value as number].inventoryUnitId =
        res.data.inventoryUnitId;
    } else {
      materialList.value[materialIndex.value as number].warehouseName =
        res.data.wareHouseName;
      materialList.value[materialIndex.value as number].warehouseId =
        res.data.wareHouseId;
      materialList.value[materialIndex.value as number].inventoryUnitName =
        res.data.inventoryUnitName;
      materialList.value[materialIndex.value as number].inventoryUnitId =
        res.data.inventoryUnitId;
    }
    getUnitList(res.data.wareHouseId);
  }
};

// 读取二维码信息
function readCARD(item: string) {
  showSuccessToast('扫码成功：'+item)
  if (!dictionaryList.value || dictionaryList.value.length === 0) {
    throw new Error("dictionaryList 为空或未定义");
  }
  // 尝试获取规则，若找不到则报错
  const materialRuleOneEntry = dictionaryList.value.find(item => item.valueKeyName === 'materialRuleOne');
  const materialRuleTwoEntry = dictionaryList.value.find(item => item.valueKeyName === 'materialRuleTwo');
  const wareRuleEntry = dictionaryList.value.find(item => item.valueKeyName === 'wareRule');
  if (!materialRuleOneEntry || !materialRuleTwoEntry || !wareRuleEntry) {
    throw new Error("未找到物料/仓库对应的规则");
  }
  // 初始化正则表达式
  const materialRuleOne = new RegExp(materialRuleOneEntry.keyValue);
  const materialRuleTwo = new RegExp(materialRuleTwoEntry.keyValue);
  const wareRule = new RegExp(wareRuleEntry.keyValue);

  const regex = /MT\.(?<materialCode>[^@]+)@@LT\.(?<lot>[\w-]+)/;
  // 如果匹配正则表达式且 feedShow 为 false，执行初始化操作
  if ((materialRuleOne.test(item) || materialRuleTwo.test(item)) && feedShow.value === false) {
    // 关闭扫码投料
    changeIn.value = false;
    // 关闭二次确认loading
    sureOperationLoading.value = false;
    // 初始化物料列表
    materialList.value = [];
    sudMaterialList.value = [];
  }

  // 二维码信息处理逻辑
  if (item.startsWith("LC.")) {
    // 如果 feedShow 为 true，处理二维码信息
    if (feedShow.value === true || sudFeedShow.value === true) {
      getMeterialWare(item); // 等待异步操作完成
    }
  } else {
    getFeedMeterial(item); // 等待异步操作完成
  }
}

// 获取采样点列表
const getPointList = async () => {
  const res = await proxy.$api.productionOperations.selectSamplePoint({
    equipId:
      (chooseDeviceId.value as number) > -1
        ? chooseDeviceId.value
        : batchDetail.value.equipId,
  });
  if (res?.code === 200) pointColumn.value = res.data.rows;
};

// 获取部门列表
const getSectionList = async () => {
  console.log("getSectionList");
  const res = await proxy.$api.productionOperations.getAllSection({
    orgFunction: 3,
  });
  if (res?.code === 200) {
    sectionOptions.value = res.data;
    if (sectionOptions.value.length > 0) {
      sectionData.name = sectionOptions.value[0].orgName;
      sectionData.id = sectionOptions.value[0].orgId;
    }
  }
};

// 仓库列表
const getWareHouseList = async () => {
  let res = await proxy.$api.productionOperations.wareHouseList({
    tenantId: 1,
  });
  if (res?.code == 200) wareColumns.value = res.data.rows;
};

// 工单产品(入库产品)
const getMfgProductByTrk = async () => {
  const sendData: any = { mfgId: mfgId.value };
  if ((chooseDeviceId.value as number) < 0) {
    sendData.batchId = batchDetail.value.batchId;
  }
  const res = await proxy.$api.productionOperations.getMfgProductByTrk(
    sendData
  );
  if (res?.code == 200) {
    trkList.value = [];
    productList.value = [];
    // 过滤入库数量为0的产品
    res.data.map((item: any) => {
      if (item.cplQty > 0) productList.value.push(item);
    });
    // productList.value = res.data;
    productList.value.map((item, index) => {
      item.trkList = [];
      addStorageInformation(0, item);
      surplusList.value[index] = item.cplQty;
    });
  }
};

// 添加包装单位/计量单位
const addStorageInformation = (index: number, obj: any) => {
  obj.trkList[index] = {
    maId: obj.maId,
    qty: "",
    qtyStu: "",
    type: 1,
    stu: obj.stu,
    inventoryUnitId: "", // 库位id
    outType: obj.outType,
    lot: obj.lot,
    pcu: "",
    pcuName: "",
    pcustucoe: "",
    inventoryUnitName: "", // 库位名
    warehouseName: "", // 仓库名
  };
};

// 获取库存单元列表
const getUnitList = async (warehouseId: any) => {
  const res = await proxy.$api.productionOperations.inventoryUnitList({
    wareHouseId: warehouseId,
  });
  if (res?.code == 200) {
    unitColumns.value = res.data.rows;
  }
};

// 点击选择物料
const chooseMaterial = (index: number) => {
  materialShowPicker.value = true;
  materialIndex.value = index;
};

// 点击选择物料仓库
const changeMerWare = (index: number) => {
  merWareShowPicker.value = true;
  materialIndex.value = index;
};

// 点击选择物料仓库
const chooseMerUnit = (index: number) => {
  merUnitShowPicker.value = true;
  materialIndex.value = index;
};

// 点击选择临时物料
const chooseSudMaterial = (index: number) => {
  sudMaterialShowPicker.value = true;
  sudMaterialIndex.value = index;
};

// 点击选择产品
const chooseProduct = (index: number) => {
  productShowPicker.value = true;
  productIndex.value = index;
};

// 点击选择仓库
const changeWare = (obj: any) => {
  wareShowPicker.value = true;
  unitPackingIndex = obj;
};

// 点击选择库位
const chooseUnit = (obj: any) => {
  unitShowPicker.value = true;
  unitPackingIndex = obj;
};

// 确认选择物料
const confirmMaterial = ({ selectedOptions }: any) => {
  materialList.value[materialIndex.value as number].maId =
    selectedOptions[0].maId;
  materialList.value[materialIndex.value as number].maName =
    detailsData.itemDisplay
      ? selectedOptions[0][detailsData.itemDisplay]
        ? selectedOptions[0][detailsData.itemDisplay]
        : selectedOptions[0].maName
      : selectedOptions[0].maName;
  materialList.value[materialIndex.value as number].unit =
    selectedOptions[0].stu;
  materialList.value[materialIndex.value as number].qty =
    selectedOptions[0].extQty;
  materialShowPicker.value = false;
};

// 确认选择物料仓库
const confirmMerWare = ({ selectedOptions }: any) => {
  if (merWarePickerType.value === 1) {
    materialList.value[materialIndex.value as number].warehouseName =
      selectedOptions[0].warehouseName;
    materialList.value[materialIndex.value as number].warehouseId =
      selectedOptions[0].warehouseId;
  } else {
    sudMaterialList.value[materialIndex.value as number].warehouseName =
      selectedOptions[0].warehouseName;
    sudMaterialList.value[materialIndex.value as number].warehouseId =
      selectedOptions[0].warehouseId;
  }
  getUnitList(selectedOptions[0].warehouseId);
  merWareShowPicker.value = false;
};

// 确认选择物料库位
const confirmMerUnit = ({ selectedOptions }: any) => {
  if (merWarePickerType.value === 1) {
    materialList.value[materialIndex.value as number].inventoryUnitName =
      selectedOptions[0].inventoryUnitName;
    materialList.value[materialIndex.value as number].inventoryUnitId =
      selectedOptions[0].inventoryUnitId;
  } else {
    sudMaterialList.value[materialIndex.value as number].inventoryUnitName =
      selectedOptions[0].inventoryUnitName;
    sudMaterialList.value[materialIndex.value as number].inventoryUnitId =
      selectedOptions[0].inventoryUnitId;
  }
  merUnitShowPicker.value = false;
};

// 确认选择临时物料
const confirmSudMaterial = ({ selectedOptions }: any) => {
  sudMaterialList.value[sudMaterialIndex.value as number].maId =
    selectedOptions[0].maId;
  sudMaterialList.value[sudMaterialIndex.value as number].maName =
    detailsData.itemDisplay
      ? selectedOptions[0][detailsData.itemDisplay]
        ? selectedOptions[0][detailsData.itemDisplay]
        : selectedOptions[0].maName
      : selectedOptions[0].maName;
  sudMaterialList.value[sudMaterialIndex.value as number].unit =
    selectedOptions[0].stu;
  sudMaterialList.value[sudMaterialIndex.value as number].qty =
    selectedOptions[0].extQty;
  sudMaterialShowPicker.value = false;
};
// 确认选择产品
const confirmProduct = ({ selectedOptions }: any) => {
  productlList.value[productIndex.value as number].maId =
    selectedOptions[0].maId;
  productlList.value[productIndex.value as number].maName =
    selectedOptions[0].maName;
  productlList.value[productIndex.value as number].unit =
    selectedOptions[0].unit;
  productShowPicker.value = false;
  // console.log(selectedOptions[0]);
};
// 确认选择仓库
const confirmWare = ({ selectedOptions }: any) => {
  // console.log(unitPackingIndex);
  getUnitList(selectedOptions[0].warehouseId);
  const chooseData =
    productList.value[unitPackingIndex.index].trkList[unitPackingIndex.key];
  chooseData.warehouseName = selectedOptions[0].warehouseName;
  wareShowPicker.value = false;
};
// 确认采样点
const confirPoint = ({ selectedOptions }: any) => {
  samplingPointData.id = selectedOptions[0].samplePointId;
  samplingPointData.name = selectedOptions[0].samplePointName;
  pointPicker.value = false;
};
const confirmSection = ({ selectedOptions }: any) => {
  sectionData.name = selectedOptions[0].orgName;
  sectionData.id = selectedOptions[0].orgId;
  sectionShow.value = false;
};
// 确认选择仓库单元
const confirmUnit = ({ selectedOptions }: any) => {
  const chooseData =
    productList.value[unitPackingIndex.index].trkList[unitPackingIndex.key];
  chooseData.inventoryUnitId = selectedOptions[0].inventoryUnitId;
  chooseData.inventoryUnitName = selectedOptions[0].inventoryUnitName;
  unitShowPicker.value = false;
};
// 确认选择包装单位
const confirmUnitPacking = ({ selectedOptions }: any) => {
  const chooseData =
    productList.value[unitPackingIndex.index].trkList[unitPackingIndex.key];
  chooseData.pcuName = selectedOptions[0].pcuName;
  chooseData.pcu = selectedOptions[0].pcuCode;
  chooseData.pcustucoe = selectedOptions[0].pcustucoe;
  unitPackingPicker.value = false;
};

// 选择包装单位
const chooseUnitPacking = (list: any, obj: any) => {
  unitPackingColumns.value = list;
  unitPackingPicker.value = true;
  unitPackingIndex = obj;
};

// 获取混批池列表
const getMixList = async () => {
  const res = await proxy.$api.productionOperations.getMfgBatchList();
  if (res?.code === 200) {
    if (mfgId.value) {
      getMixDetail(mfgId.value, chooseOrderName.value);
    } else {
      getMixDetail(res.data.rows[0].batchId, res.data.rows[0].batchNo);
      mfgId.value = res.data.rows[0].batchId;
    }
    buttonStore.setButtonList([]);
  }
};

// 确认参数
const confirmParams = async () => {
  const sendData: any = {
    taskId: currentTask.value?.taskId
      ? currentTask.value?.taskId
      : currentTask.value[taskIndex.value]?.taskId,
    procInsId: chooseTabData.value.procInsId,
    operateId: activeTab.value,
    variables: {},
    // comment: '通过'
  };
  const operateParamInput: any[] = [];
  paramsData.value.map((item: any) => {
    operateParamInput.push({
      paramKey: item.parameters,
      paramValue: item.defaultValue,
    });
  });
  sendData.variables.operateParamInput = JSON.stringify(operateParamInput);
  const res = await proxy.$api.productionOperations.processComplete(sendData);
  if (res?.code === 200) {
    paramsInputShow.value = false;
    showSuccessToast(res.message);
    getDetail();
  }
};

// 计算用时
function calculateTimeDifference(startTime: string, endTime: string): string {
  // 转换为 dayjs 对象
  const start = dayjs(startTime);
  const end = dayjs(endTime);

  // 计算差值（毫秒）
  const diffMilliseconds = end.diff(start);

  // 计算秒、分钟、小时、天
  const diffSeconds = Math.floor(diffMilliseconds / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  // 计算剩余的小时、分钟、秒
  const days = diffDays;
  const hours = diffHours % 24;
  const minutes = diffMinutes % 60;
  const seconds = diffSeconds % 60;

  // 构建返回字符串
  let result = "";
  if (days > 0) result += `${days}天`;
  if (hours > 0) result += `${hours}时`;
  if (minutes > 0) result += `${minutes}分`;
  if (seconds > 0) result += `${seconds}秒`;

  // 如果全部为0，返回"0秒"
  return result || "0秒";
}

// 点击并行网关对应节点
function clickTask(index: number, data: any) {
  taskIndex.value = index;
  changeButtonStatus(detailsData, data);
}
function changeButtonStatus(data: any, currentTask: any) {
  if (data.status === 11) {
    // 11 表示所有工序都完成
    // 生产报工
    buttonStore.setButtonList(buttonStatus["default"]);
  } else if (data.status === 2) {
    if (!data.batchId) {
      buttonStore.setButtonList(buttonType[2]);
    } else buttonStore.setButtonList(buttonType[3]);
  } else {
    currentTask.taskType
      ? buttonStore.setButtonList(
          buttonStatus[currentTask.taskType == 1 ? 2 : currentTask.taskType]
        )
      : buttonStore.setButtonList(
          buttonStatus[
            currentTask[taskIndex.value].taskType == 1
              ? 2
              : currentTask[taskIndex.value].taskType
          ]
        );
  }
}

watch(
  () => feedShow.value,
  (val: boolean) => {
    if (val) merWarePickerType.value = 1;
  }
);

watch(
  () => sudFeedShow.value,
  (val: boolean) => {
    if (val) merWarePickerType.value = 2;
  }
);

watch(
  () => buttonStore.getButtonList,
  (val: any) => {
    buttonList.value = val;
  },
  {
    deep: true,
  }
);

watch(
  () => productList.value[activeProduct.value],
  (val: any) => {
    let num = 0;
    val.trkList.map((item: any) => {
      if (item.type === 1) {
        num += Number(item.qtyStu || 0);
      } else {
        num += (item.qty || 0) * (item.pcustucoe || 0);
        item.qtyStu = (item.qty || 0) * (item.pcustucoe || 0);
      }
    });
    surplusList.value[activeProduct.value] = (val.cplQty - num).toFixed(2);
  },
  { deep: true }
);

onMounted(() => {
  getDetail();
  getWareHouseList();
  getDictionaryList('materialRules');
  // 将要给原生调用的方法挂载到 window 上面
  (window as any).readCARD = (item: any) => {
    return readCARD(item);
  };
});
</script>

<style lang="scss" scoped>
.tracking {
  background-color: $default-bgc;
  height: 100%;
  overflow: auto;
  position: relative;
  .wareFind {
    display: flex;
    align-items: center;
    background-color: #fff;
  }

  .content {
    max-height: 360px;
    padding: 8px 0;
    overflow: auto;
    .intoStorage-content {
      margin-top: 10px;

      // display: flex;
      &-item {
        padding: 8px;

        .label {
          width: 60px;
          text-align: left;
        }

        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .addButton {
        text-align: center;
        padding: 8px;
        color: #ee0a24;
      }
    }
  }

  .confirm-content {
    padding: 24px;
    background-color: rgba(255, 255, 255, 0.7);
    width: 240px;
    height: 240px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    .button-group {
      display: flex;
      justify-content: space-between;
    }
  }

  .swipe-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 16px;
  }

  .pop-content {
    height: calc(100% - 45px);
    overflow: auto;
    .content {
      max-height: 360px;
      padding: 8px 0;
      overflow: auto;
      .item-content {
        background-color: #f7f8fa;
        position: relative;

        .item-title {
          color: rgb(143, 157, 163);
          margin-bottom: 8px;
          margin-left: 18px;
        }

        .delete-icon {
          position: absolute;
          top: 4px;
          right: 8px;
        }
      }
    }
  }

  .button-bottom {
    min-height: 8%;
    padding: 8px;
    background-color: #fff;
    position: fixed;
    bottom: 0px;
    width: 100%;
    text-align: right;
    // display: flex;
    // justify-content: end;
    z-index: 99;

    .m18 {
      width: 7rem;
      margin-left: 24px;
    }
  }

  .task-detail {
    padding: 20px;
    background-color: #fff;

    .title {
      padding-bottom: 10px;
      font-size: large;
    }

    .body {
      p {
        padding-bottom: 5px;
        color: #999;
      }
    }
  }

  .process {
    padding: 25px;
    margin-top: 10px;
    margin-bottom: 68px;
    background-color: #fff;
    min-height: calc(100% - 240px);

    p {
      padding-top: 5px;
      color: #999;
    }
  }
}
</style>
