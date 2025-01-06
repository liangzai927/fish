<template>
  <van-form ref="processRef">
    <van-cell-group inset>
      <template v-for="(widget, index) in flowWidgets" :key="index">
        <!-- 输入框 -->
        <template
          v-if="
            widget.type == WIDGET.SINGLELINE_TEXT &&
            flowFormType(widget.name) != '3'
          "
        >
          <van-field
            v-model="flowForm[widget.name]"
            :name="widget.name"
            :label="widget.label"
            :placeholder="widget.placeholder"
            :disabled="flowFormType(widget.name) == '2'"
            :required="widget.required && flowFormType(widget.name) != '2'"
            :rules="[
              {
                required: widget.required && flowFormType(widget.name) != '2',
                message: '请输入',
              },
            ]"
          />
        </template>

        <!-- 文本框 -->
        <template
          v-if="
            widget.type == WIDGET.MULTILINE_TEXT &&
            flowFormType(widget.name) != '3'
          "
        >
          <van-field
            autosize
            v-model="flowForm[widget.name]"
            :name="widget.name"
            :label="widget.label"
            :placeholder="widget.placeholder"
            :disabled="flowFormType(widget.name) == '2'"
            :rules="[
              {
                required: widget.required && flowFormType(widget.name) != '2',
                message: '请输入',
              },
            ]"
            :required="widget.required && flowFormType(widget.name) != '2'"
          />
        </template>

        <!-- 数字 -->
        <template
          v-if="
            widget.type == WIDGET.NUMBER && flowFormType(widget.name) != '3'
          "
        >
          <van-field
            :name="widget.name"
            :label="widget.label"
            input-width="100px"
            :disabled="flowFormType(widget.name) == '2'"
            :rules="[
              {
                required: widget.required && flowFormType(widget.name) != '2',
                message: '请输入',
              },
            ]"
            :required="widget.required && flowFormType(widget.name) != '2'"
          >
            <template #input>
              <van-stepper
                v-model="flowForm[widget.name]"
                :decimal-length="4"
                :disabled="flowFormType(widget.name) == '2'"
              />
            </template>
          </van-field>
        </template>

        <!-- 金额 -->
        <template
          v-if="widget.type == WIDGET.MONEY && flowFormType(widget.name) != '3'"
        >
          <van-field
            :name="widget.name"
            :label="widget.label"
            :disabled="flowFormType(widget.name) == '2'"
            input-width="100px"
            :rules="[
              {
                required: widget.required && flowFormType(widget.name) != '2',
                message: '请输入',
              },
            ]"
            :required="widget.required && flowFormType(widget.name) != '2'"
          >
            <template #input>
              <van-stepper
                v-model="flowForm[widget.name]"
                input-width="40px"
                :decimal-length="2"
                :disabled="flowFormType(widget.name) == '2'"
              />
              <span>CNY-人民币元</span>
            </template>
          </van-field>
        </template>

        <!-- 开关 -->
        <template
          v-if="
            widget.type == WIDGET.SWITCH && flowFormType(widget.name) != '3'
          "
        >
          <van-field
            :name="widget.name"
            :label="widget.label"
            :placeholder="widget.placeholder"
            :disabled="flowFormType(widget.name) == '2'"
            :rules="[
              {
                required: widget.required && flowFormType(widget.name) != '2',
                message: '请选择',
              },
            ]"
            :required="widget.required && flowFormType(widget.name) != '2'"
          >
            <template #input>
              <van-switch
                v-model="flowForm[widget.name]"
                :inactive-value="0"
                :active-value="1"
                :disabled="flowFormType(widget.name) == '2'"
                :name="
                  flowForm[widget.name]
                    ? widget.checkedChildren
                    : widget.unCheckedChildren
                "
              />
            </template>
          </van-field>
        </template>

        <!-- 单选 -->
        <template
          v-if="
            widget.type == WIDGET.SINGLE_CHOICE &&
            flowFormType(widget.name) != '3'
          "
        >
          <van-field
            :name="widget.name"
            :label="widget.label"
            :placeholder="widget.placeholder"
            :disabled="flowFormType(widget.name) == '2'"
            :rules="[
              {
                required: widget.required && flowFormType(widget.name) != '2',
                message: '请选择',
              },
            ]"
            :required="widget.required && flowFormType(widget.name) != '2'"
          >
            <template #input>
              <van-radio-group v-model="flowForm[widget.name]">
                <van-radio
                  style="margin-bottom: 4px"
                  v-for="(option, index) in widget.options"
                  :key="index"
                  :name="option"
                  :disabled="flowFormType(widget.name) == '2'"
                  >{{ option }}</van-radio
                >
              </van-radio-group>
            </template>
          </van-field>
        </template>

        <!-- 多选ing -->
        <template
          v-if="
            widget.type == WIDGET.MULTI_CHOICE &&
            flowFormType(widget.name) != '3'
          "
        >
          <van-field
            :name="widget.name"
            :label="widget.label"
            :placeholder="widget.placeholder"
            :disabled="flowFormType(widget.name) == '2'"
            :rules="[
              {
                required: widget.required && flowFormType(widget.name) != '2',
                message: '请选择',
              },
            ]"
            :required="widget.required && flowFormType(widget.name) != '2'"
          >
            <template #input>
              <van-checkbox-group v-model="flowForm[widget.name]">
                <van-checkbox
                  style="margin-bottom: 4px"
                  v-for="(option, index) in widget.options"
                  :key="index"
                  :name="option"
                  :disabled="flowFormType(widget.name) == '2'"
                  >{{ option }}</van-checkbox
                >
              </van-checkbox-group>
            </template>
          </van-field>
        </template>

        <!-- 日期 -->
        <div
          v-if="widget.type == WIDGET.DATE && flowFormType(widget.name) != '3'"
        >
          <van-field
            v-model="flowForm[widget.name]"
            :name="widget.name"
            :label="widget.label"
            :placeholder="widget.placeholder"
            :disabled="flowFormType(widget.name) == '2'"
            @click.stop="clickChoose(widget, 'data')"
            @focus="forbid"
            :rules="[
              {
                required: widget.required && flowFormType(widget.name) != '2',
                message: '请选择日期',
              },
            ]"
            :required="widget.required && flowFormType(widget.name) != '2'"
          />
          <van-popup v-model:show="show.showDataPicker" position="bottom">
            <van-date-picker
              v-model="dateArray"
              @confirm="(e: any) => onDataConfirm(e)"
              @cancel="show.showDataPicker = false"
              :disabled="flowFormType(widget.name) == '2'"
            />
          </van-popup>
        </div>

        <!-- 日期区间 -->
        <div
          v-if="
            widget.type == WIDGET.DATE_RANGE && flowFormType(widget.name) != '3'
          "
        >
          <template v-if="flowForm?.[widget.name]?.[0]">
            <van-field
              v-model="flowForm[widget.name][0]"
              :name="widget.name"
              :label="widget.label + '(开始时间)'"
              :placeholder="widget.placeholder"
              @click="clickChoose(widget, 'dataLineOne')"
              :disabled="flowFormType(widget.name) == '2'"
              @focus="forbid"
              :rules="[
                {
                  required: widget.required && flowFormType(widget.name) != '2',
                  message: '请选择日期',
                },
              ]"
              :required="widget.required && flowFormType(widget.name) != '2'"
            />
          </template>
          <template v-else>
            <van-field
              v-model="pop.startTime"
              :name="widget.name"
              :label="widget.label + '(开始时间)'"
              :placeholder="widget.placeholder"
              @click="clickChoose(widget, 'dataLineOne')"
              :disabled="flowFormType(widget.name) == '2'"
              @focus="forbid"
              :rules="[
                {
                  required: widget.required && flowFormType(widget.name) != '2',
                  message: '请选择日期',
                },
              ]"
              :required="widget.required && flowFormType(widget.name) != '2'"
            />
          </template>
          <van-popup v-model:show="show.showDataLineOne" position="bottom">
            <van-date-picker
              @confirm="(e: any) => onDataRangeConfirm(e, '1')"
              @cancel="show.showDataLineOne = false"
              :disabled="flowFormType(widget.name) == '2'"
            />
          </van-popup>
          <template v-if="flowForm?.[widget.name]?.[1]">
            <van-field
              v-model="flowForm[widget.name][1]"
              :name="widget.name"
              :label="widget.label + '(结束时间)'"
              :placeholder="widget.placeholder"
              @click="clickChoose(widget, 'dataLineTwo')"
              :disabled="flowFormType(widget.name) == '2'"
              @focus="forbid"
              :rules="[
                {
                  required: widget.required && flowFormType(widget.name) != '2',
                  message: '请选择日期',
                },
              ]"
              :required="widget.required && flowFormType(widget.name) != '2'"
            />
          </template>
          <template v-else>
            <van-field
              v-model="pop.endTime"
              :name="widget.name"
              :label="widget.label + '(结束时间)'"
              :placeholder="widget.placeholder"
              @click="clickChoose(widget, 'dataLineTwo')"
              :disabled="flowFormType(widget.name) == '2'"
              @focus="forbid"
              :rules="[
                {
                  required: widget.required && flowFormType(widget.name) != '2',
                  message: '请选择日期',
                },
              ]"
              :required="widget.required && flowFormType(widget.name) != '2'"
            />
          </template>

          <van-popup v-model:show="show.showDataLineTwo" position="bottom">
            <van-date-picker
              @confirm="(e: any) => onDataRangeConfirm(e, '2')"
              @cancel="show.showDataLineTwo = false"
              :disabled="flowFormType(widget.name) == '2'"
            />
          </van-popup>
        </div>

        <!-- 图片 -->
        <div
          v-if="
            widget.type == WIDGET.PICTURE && flowFormType(widget.name) != '3'
          "
        >
          <van-field
            :name="widget.name"
            :label="widget.label"
            :placeholder="widget.placeholder"
            :disabled="flowFormType(widget.name) == '2'"
            :rules="[
              {
                required: widget.required && flowFormType(widget.name) != '2',
                message: '请上传',
              },
            ]"
            :required="widget.required && flowFormType(widget.name) != '2'"
          >
            <template #input>
              <CommonUpload
                type="picture"
                :id="widget.name"
                :imageUrl="flowForm[widget.name]"
                @getUrl="getUrl"
                :disabled="flowFormType(widget.name) == '2'"
                v-if="flowFormType(widget.name) != '2'"
              />
              <van-image
                width="50"
                height="50"
                :src="flowForm[widget.name]"
                v-if="flowFormType(widget.name) == '2'"
                @click.stop="showImagePreview([flowForm[widget.name]])"
              />
            </template>
          </van-field>
        </div>

        <!-- 附件 -->
        <div
          v-if="
            widget.type == WIDGET.ATTACHMENT && flowFormType(widget.name) != '3'
          "
        >
          <van-field
            :name="widget.name"
            :label="widget.label"
            :placeholder="widget.placeholder"
            :disabled="flowFormType(widget.name) == '2'"
            :rules="[
              {
                required: widget.required && flowFormType(widget.name) != '2',
                message: '请上传',
              },
            ]"
            :required="widget.required && flowFormType(widget.name) != '2'"
          >
            <template #input>
              <CommonUpload
                type="button"
                :id="widget.name"
                :imageUrl="flowForm[widget.name]"
                @getUrl="getUrl"
                :disabled="flowFormType(widget.name) == '2'"
                v-if="flowFormType(widget.name) != '2'"
              />
              <van-image
                width="50"
                height="50"
                :src="flowForm[widget.name]"
                v-if="flowFormType(widget.name) == '2'"
                @click.stop="showImagePreview([flowForm[widget.name]])"
              />
            </template>
          </van-field>
        </div>

        <!-- 部门 -->
        <div
          v-if="
            widget.type == WIDGET.DEPARTMENT && flowFormType(widget.name) != '3'
          "
        >
          <van-field
            v-if="flowForm[widget.name]"
            :name="widget.name"
            :label="widget.label"
            :model-value="findOrgName(flowForm[widget.name])"
            :placeholder="widget.placeholder"
            :disabled="flowFormType(widget.name) == '2'"
            @click="clickChoose(widget, 'dep')"
            @focus="forbid"
            :rules="[
              {
                required: widget.required && flowFormType(widget.name) != '2',
                message: '请选择',
              },
            ]"
            :required="widget.required && flowFormType(widget.name) != '2'"
          >
          </van-field>
          <van-field
            v-else
            v-model="pop.depName"
            :name="widget.name"
            :label="widget.label"
            :placeholder="widget.placeholder"
            :disabled="flowFormType(widget.name) == '2'"
            @click="clickChoose(widget, 'dep')"
            @focus="forbid"
            :rules="[
              {
                required: widget.required && flowFormType(widget.name) != '2',
                message: '请选择',
              },
            ]"
            :required="widget.required && flowFormType(widget.name) != '2'"
          />
          <van-popup v-model:show="show.showDePicker" position="bottom">
            <van-cascader
              title="请选择相应部门"
              :options="userData.orgList"
              :disabled="flowFormType(widget.name) == '2'"
              :field-names="{
                text: 'orgName',
                value: 'orgId',
                children: 'childList',
              }"
              @close="show.showDePicker = false"
              @finish="(e: any) => onDepConfirm(e)"
            />
          </van-popup>
        </div>

        <!-- 员工 -->
        <!-- :name="widget.name" -->
        <template
          v-if="
            widget.type == WIDGET.EMPLOYEE && flowFormType(widget.name) != '3'
          "
        >
          <van-field
            v-if="flowForm[widget.name]"
            :name="widget.name"
            :label="widget.label"
            :placeholder="widget.placeholder"
            :disabled="flowFormType(widget.name) == '2'"
            :rules="[
              {
                required: widget.required && flowFormType(widget.name) != '2',
                message: '请选择',
              },
            ]"
            :required="widget.required && flowFormType(widget.name) != '2'"
          >
            <template #input>
              <div
                class="choose-user"
                v-for="user in filterUsersByNodeChoose(flowForm[widget.name])"
                :key="user.userId"
                :style="{
                  color: flowFormType(widget.name) == '2' ? '#c8c9cc' : '',
                }"
              >
                {{ user.userName }}
              </div>
            </template>
          </van-field>
          <van-field
            v-else
            :name="widget.name"
            :label="widget.label"
            v-model="pop.employee"
            :placeholder="widget.placeholder"
            :disabled="flowFormType(widget.name) == '2'"
            :rules="[
              {
                required: widget.required && flowFormType(widget.name) != '2',
                message: '请选择',
              },
            ]"
            :required="widget.required && flowFormType(widget.name) != '2'"
          >
            <template #input>
              <van-button
                style="height: 30px; width: 24px"
                @click="addNodeMan(widget, 'form')"
                :disabled="flowFormType(widget.name) == '2'"
                v-if="flowFormType(widget.name) != '2'"
                >+</van-button
              >
              <div
                class="choose-user"
                v-for="user in filterUsersByNodeChoose(nodeChoose[widget.name])"
                :key="user.userId"
              >
                <van-image
                  width="36px"
                  height="36px"
                  src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
                />
                {{ user.userName }}
              </div>
            </template>
          </van-field>
        </template>

        <!-- 提示文字 -->
        <template
          v-if="
            widget.type == WIDGET.DESCRIBE && flowFormType(widget.name) != '3'
          "
        >
          <van-field
            :name="widget.name"
            :label="widget.label"
            :placeholder="widget.placeholder"
            disabled
            right-icon="warning-o"
            :rules="[
              {
                required: widget.required && flowFormType(widget.name) != '2',
                message: '请输入',
              },
            ]"
            :required="widget.required && flowFormType(widget.name) != '2'"
          >
          </van-field>
        </template>
      </template>
    </van-cell-group>
  </van-form>
  <ChoosePerson
    v-if="userChoose"
    v-model="userChoose"
    :usrChooseId="nodeUserIds"
    @getIds="getChooseUser"
  />
</template>

<script setup lang="ts">
import ChoosePerson from "../../../components/ChoosePerson.vue";
import CommonUpload from "../../../components/CommonUpload.vue";
import { showImagePreview } from "vant";
import dayjs from "dayjs";

interface Props {
  flowWidgets: any;
  contentJSON: any;
  nodeKey: string;
  flowForm: any;
  formContent: any;
  nodeChoose: any;
}

interface Emit {
  (e: "submit"): void;
}

const emits = defineEmits<Emit>();
const props = withDefaults(defineProps<Props>(), {
  flowWidgets: () => null,
  contentJSON: () => null,
  nodeKey: "",
  flowForm: () => {},
  formContent: () => {},
  nodeChoose: () => {},
});
const api: any = inject("$api");
// let flowForm: any = reactive({}); // 流程的表单
const curWidgets = ref<any>();
const show = reactive({
  dialogShow: false,
  showUserPicker: false,
  showDePicker: false,
  showDataPicker: false,
  showDataLineOne: false,
  showDataLineTwo: false,
});
const pop: any = reactive({});
const userData: any = reactive({
  orgList: [],
  userList: [],
});
const userChoose = ref<boolean>(false);
const openType = ref<string>("");
const curActivityId = ref<any>();
const curDataType = ref<any>();
const nodeUserIds = ref([]);
const processRef: Ref = ref(null);
const dateArray = ref<string[]>(dayjs().format("YYYY-MM-DD").split("-"));

// 流程组件
const WIDGET = {
  SINGLELINE_TEXT: 0, //"单行文本"
  MULTILINE_TEXT: 1, //"多行文本"
  DESCRIBE: 2, //"提示文字"
  NUMBER: 3, //"数字"
  MONEY: 4, //"金额"
  SINGLE_CHOICE: 5, //"单选"
  MULTI_CHOICE: 6, //"多选"
  DATE: 7, //"日期"
  DATE_RANGE: 8, //"日期区间"
  DETAIL: 9, //"明细"
  PICTURE: 10, //"图片"
  ATTACHMENT: 11, //"附件"
  DEPARTMENT: 12, //"部门"
  EMPLOYEE: 13, //"员工"
  ADDRESS: 14, //"地址"
  SWITCH: 15, //"开关"
};

const departmentValue = computed(() => {
  return findOrgName(
    props.flowForm[
      props.flowWidgets.find((item: any) => item.type === WIDGET.DEPARTMENT)
        .name
    ]
  );
});

const employeeValue = computed(() => {
  return findUserName(
    props.flowForm[
      props.flowWidgets.find((item: any) => item.type === WIDGET.EMPLOYEE).name
    ]
  );
});

// 获取部门
const getOrgList = async () => {
  let res = await api.workFlow.orgListHttp();
  if (res.code == 200) userData.orgList = res.data;
};

// 获取角色
const getUserList = async () => {
  const res = await api.workFlow.managerListHttp();
  if (res.code == 200) userData.userList = res.data;
};

const clickChoose = (widget: any, type: any) => {
  curWidgets.value = widget;
  switch (type) {
    case "user":
      show.showUserPicker = true;
      break;
    case "dep":
      show.showDePicker = true;
      break;
    case "data":
      show.showDataPicker = true;
      break;
    case "dataLineOne":
      show.showDataLineOne = true;
      break;
    case "dataLineTwo":
      show.showDataLineTwo = true;
      break;
  }
};

// 选择日期
const onDataConfirm = (e: any) => {
  show.showDataPicker = false;
  props.flowForm[curWidgets.value.name] = e.selectedValues.join("-");
  pop.dataName = e.selectedValues.join("-");
};

// 选择日期区间
const onDataRangeConfirm = (e: any, type: string) => {
  const widgetName = curWidgets.value.name;
  if (!props.flowForm[widgetName]) {
    props.flowForm[widgetName] = ["", ""]; // 初始化为包含两个空字符串的数组
  }
  if (type === "1") {
    show.showDataLineOne = false;
    props.flowForm[widgetName][0] = e.selectedValues.join("-");
    pop.startTime = e.selectedValues.join("-");
  } else {
    show.showDataLineTwo = false;
    props.flowForm[widgetName][1] = e.selectedValues.join("-");
    pop.endTime = e.selectedValues.join("-");
  }
};

// 保存上传文件
const getUrl = (url: any, id: any) => {
  props.flowForm[id] = url;
};

// 选择部门
const onDepConfirm = (e: any) => {
  props.flowForm[curWidgets.value.name] = e.selectedOptions.map(
    (item: any) => item.orgId
  );
  pop.depName = e.selectedOptions[e.selectedOptions.length - 1].orgName;
  show.showDePicker = false;
};

// 点击添加节点选择人/表单选择人员
const addNodeMan = (item: any, type: string) => {
  // 判断时表格还是节点
  openType.value = type;
  userChoose.value = true;
  if (type === "node") {
    curActivityId.value = item.activityId;
    curDataType.value = item.dataType;
  } else {
    curActivityId.value = item.name;
  }
  nodeUserIds.value = props.nodeChoose[curActivityId.value];
};

// 保存选择人员
const getChooseUser = (chooseId: any[]) => {
  props.nodeChoose[curActivityId.value] = chooseId;
  pop.employee = chooseId;
};

function filterUsersByNodeChoose(nodeChooseActivityId: any) {
  // 假设 userData.userList 是已定义的用户列表
  if (nodeChooseActivityId) {
    return userData.userList.filter((user: any) =>
      nodeChooseActivityId.includes(user.userId)
    );
  }
}

function confirm() {
  console.log();
  processRef.value.validate().then(() => {
    emits("submit");
  });
}

// 递归查询部门名称
function findOrgName(curOrgId: any) {
  if (curOrgId !== undefined) {
    let orgName: any = null;
    function traverse(orgs: any) {
      if (!Array.isArray(orgs)) return;
      for (const org of orgs) {
        // 如果找到匹配的 orgId，设置 orgName
        if (
          org.orgId ===
          (Array.isArray(curOrgId) ? curOrgId[curOrgId.length - 1] : curOrgId)
        ) {
          orgName = org.orgName;
          return;
        }
        // 如果有子部门，递归查找
        if (org.childList) {
          traverse(org.childList);
        }
        // 如果已经找到了 orgName，就停止递归
        if (orgName) return;
      }
    }

    // 开始遍历 orgList
    traverse(userData.orgList);
    return orgName;
  } else {
    return curOrgId;
  }
}

// 递归查询角色名称
function findUserName(userIds: number[]): string {
  let result: string[] = [];

  // 递归函数：遍历树结构
  function traverse(node: any) {
    // 如果当前节点的 userId 在 userIds 中，拼接 userName
    if (userIds.includes(node.userId)) {
      result.push(node.userName);
    }

    // 如果有子节点，则递归遍历
    if (node.children && node.children.length > 0) {
      node.children.forEach((child: any) => traverse(child));
    }
  }

  // 遍历树结构中的每个节点
  userData.userList.forEach((node: any) => traverse(node));

  // 返回拼接后的 userName 字符串
  return result.join(", ");
}

const flowFormType = (name?: string) => {
  if (!name) return "1";
  const formItem = props.contentJSON[props.nodeKey as any].find(
    (item: any) => item.name === name
  );
  return formItem ? formItem.state : "1";
};

function forbid() {
  //禁止软键盘弹出
  (document as any).activeElement.blur();
}

defineExpose({
  getOrgList,
  getUserList,
  confirm,
});
</script>

<style scoped lang="scss">
.van-popup {
  overflow-y: auto;
}
input[aria-hidden="true"] {
  display: none !important;
}
</style>
<style>
.van-picker__frame {
  position: absolute !important;
}
</style>
