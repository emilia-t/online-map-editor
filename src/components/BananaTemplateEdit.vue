<template>
  <div class="BananaTemplateEdit">
    <div class="templateMenu" @click.stop="void 0" v-if="templateShow">
      <div class="templateTitle">
        <span>模板设置：{{EditName}}</span>
      </div>
      <div class="templateContent">
        <div class="templateLeft">
          <div class="templateSel" v-for="( nifty , index ) in niftyList">
            <span class="nifty"       ref="nifty" @click="switchTemplateNifty(index+1)" v-if="templateNifty===index+1" v-text="nifty"></span>
            <span class="unNifty"  ref="nifty" @click="switchTemplateNifty(index+1)" v-if="templateNifty!==index+1" v-text="nifty"></span>
          </div>
        </div>
        <div class="templateRight">
          <div class="templateNifty" v-if="templateNifty===1"><!--模板使用方法-->
            <div class="HContent">
              <div class="textH1">
                模板使用说明
              </div>
              <div class="textH2">
                欢迎使用模板，在使用模板之前，您需要仔细阅读此说明书以更好的使用模板的相关功能，您在使用过程中如遇到任何问题请在此页面内寻找相应的帮助信息，感谢您的使用。
              </div>
              <div class="textH3">
                模板简介：
              </div>
              <div class="textH2">
                模板，是分组图层内置的一个用于规范分组内元素成员的基本规则或条例。使用模板可以限制分组内可添加的元素类型，规定成员的属性名称，或者依据成员的某项属性来自动设置其颜色、宽度等参数。为便于理解，我们会在之后的文档中，逐一介绍模板的各项功能与使用方法：包括模板状态、模板锁、设置基本类型、设置属性规则、设置颜色规则、设置宽度规则。<span class="textH4">我们会在需要重点关注的地方使用红色字体以显著。</span>
              </div>
              <div class="textH3">
                模板状态：
              </div>
              <div class="textH2">
                模板状态，是指该分组的模板的健康状态，有以下几种状态：1.正常，2.异常，3.空的，其中第3种状态是指此分组的模板不存在或为null值。如果模板状态为异常，则此分组模板无法正常运作，需要进行修复。<span class="textH4">您可以依次点击“模板状态”->“当前状态”->“(点击修复)”进行模板修复。</span>
              </div>
              <div class="textH3">
                模板锁：
              </div>
              <div class="textH2">
                模板锁，是用于防止模板被误修改的一种状态，当模板锁处于锁定状态时，所有的规则将无法编辑，也无法上传。<span class="textH4">您可以依次点击“模板状态”->“锁定状态”->“(点击锁定)”进行锁定或解除锁定。</span>
              </div>
              <div class="textH3">
                设置基本类型：
              </div>
              <div class="textH2">

              </div>
            </div>
            <div class="Navigation">
              <div class="NavigationTi">文档导航</div>
              <div class="NavigationLi">模板简介</div>
              <div class="NavigationLi">模板状态</div>
              <div class="NavigationLi">模板锁</div>
              <div class="NavigationLi">设置基本类型</div>
            </div>
          </div>
          <div class="templateNifty" v-if="templateNifty===2">
            <div class="TContent" >
              <div class="statusList cursorDefault">
                <span class="ListLeft">当前状态</span>
                <span class="ListRight" style="cursor:pointer" @click.stop="tpManualCheck()">{{templateStatus}}</span>
              </div>
              <div class="statusList cursorDefault">
                <span class="ListLeft">锁定状态</span>
                <span class="ListRight" style="cursor:pointer" @click.stop="lockUnlock()" v-show="!editTemplate.locked">未锁定(点击锁定)</span>
                <span class="ListRight" style="cursor:pointer" @click.stop="lockUnlock()" v-show="editTemplate.locked">已锁定(点击解锁)</span>
              </div>
              <div class="statusList">
                <span class="ListLeft cursorDefault">模板名称</span>
                <span class="ListRight">
                  <input class="statusInput" type="text" placeholder="未命名模板" v-model="editTemplate.name" :disabled="editTemplate.locked" @focus="onFocusMode()" @blur="noFocusMode()"/>
                </span>
              </div>
              <div class="statusList">
                <span class="ListLeft cursorDefault">描述信息</span>
                <span class="ListRight">
                  <input class="statusInput" type="text" placeholder="空的描述信息" v-model="editTemplate.explain" :disabled="editTemplate.locked" @focus="onFocusMode()" @blur="noFocusMode()"/>
                </span>
              </div>
              <div class="statusList cursorDefault">
                <span class="ListLeft">创建者</span>
                <span class="ListRight">{{editTemplate.creator}}</span>
              </div>
              <div class="statusList cursorDefault">
                <span class="ListLeft">修改日期</span>
                <span class="ListRight">{{editTemplate.modify}}</span>
              </div>
              <div class="statusList cursorDefault">
                <div class="ListLeft">应用规则一览</div>
                <div class="ListRight"  style="align-items: start">
                  <div class="ListRightText">
                      允许类型：{{overviewType}}
                  </div>
                  <div class="ListRightText">
                      元素属性：{{overviewDetails}}
                  </div>
                  <div class="ListRightColor">
                    <div class="overviewStart">
                      颜色规则：
                    </div>
                      <div class="overviewRule" v-for="item in overviewColor">
                        <div class="overviewText">{{item.str}} ⇒ </div>
                        <div class="overviewColor" :style="{background:item.color}"></div>
                      </div>
                  </div>
                  <div class="ListRightColor">
                    <div class="overviewStart">
                      宽度规则：
                    </div>
                    <div class="overviewRule" v-for="item in overviewWidth">
                      <div class="overviewText">{{item.str}}</div>
                      <div class="overviewText"> ⇒ {{item.width}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="templateNifty" v-if="templateNifty===3"><!--设置基本类型-->
            <div class="TContent">
              <div class="setList">
                <div class="setTitle">
                  快速应用模板
                </div>
                <div class="setExplain">
                  点击使用本地或在线的模板快速的设置您的模板，也可以依据这些模板进行细节的调整。
                </div>
                <div class="setSelect">
                  <div  class="setSelectBox" :class="tmp.use?'useTemplate':'unUseTemplate'" :key="tmp.id" v-for="tmp in localTemplate">
                    <span  :style="viewBoxStyle(tmp)" @click="useLocalTemplate(tmp.id)">
                      {{tmp.name}}
                    </span>
                  </div>
                </div>
              </div>
              <div class="setList">
                <div class="setTitle">
                  设置元素类型
                </div>
                <div class="setExplain">
                  点击选择允许加入此分组的元素类型，来限制此分组下的成员元素类型。注意：在您点击“应用”之前都可以更改此项，一旦点击了“应用”之后，此分组内不允许加入的元素将会被移除出此分组。
                </div>
                <div class="setChoice">
                  <div class="setChoiceBox" :class="status?'useTemplate':'unUseTemplate'" :key="type" v-for="(status,type) in editTemplate.typeRule">
                    <span @click="allowType(type)">
                      {{type}}
                    </span>
                  </div>
                </div>
              </div>
              <div class="setList">
                <div class="setTitle">
                  选中与未选中图示
                </div>
                <div class="setChoice">
                  <div class="setChoiceBox useTemplate">
                    <span>
                      选中状态
                    </span>
                  </div>
                  <div class="setChoiceBox unUseTemplate">
                    <span>
                      未选中状态
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="templateNifty" v-if="templateNifty===4"><!--设置属性规则-->
            <div class="TContent">
              <div class="setList">
                <div class="setTitle">
                  设置属性规则
                </div>
                <div class="setExplain">
                  在下方的表格中，点击填写或修改元素的属性规则。注意：在点击“应用”之前都可以再次修改以下规则，一旦点击了“应用”之后，不符合以下属性规则的元素将会被强制修改。另外，如果属性名存在重复，则只保留最初的一条。
                </div>
                <div class="detailsSheet">
                  <div class="SheetRow RowTitle">
                    <div class="SheetCo0" title="点击切换为删除模式" @click="switchDelMod1=true" v-show="!switchDelMod1">
                      <trash-can></trash-can>
                    </div>
                    <div class="SheetCo0" title="点击切换为排序模式" @click="switchDelMod1=false" v-show="switchDelMod1">
                      <arrow-up></arrow-up>
                    </div>
                    <div class="SheetCo1">
                      属性名
                    </div>
                    <div class="SheetCo2">
                      默认值
                    </div>
                    <div class="SheetCo3">
                      类型
                    </div>
                    <div class="SheetCo4">
                      长度
                    </div>
                    <div class="SheetCo5">
                      为空
                    </div>
                  </div>
                  <div class="SheetRow RowText" v-for="(item,index) in this.editTemplate.detailsRule">
                    <div class="SheetCo0">
                      <span @click.stop="detailsUp(index)" v-show="!switchDelMod1"><arrow-up></arrow-up></span>
                      <span @click.stop="detailsDown(index)" v-show="!switchDelMod1"><arrow-down></arrow-down></span>
                      <span @click.stop="deleteDetails(index)" v-show="switchDelMod1"><trash-can></trash-can></span>
                    </div>
                    <div class="SheetCo1">
                      <input class="SheetInput" type="text" v-model="item.name" :disabled="editTemplate.locked || item.name==='name'" @focus="onFocusMode()" @blur="noFocusMode()"/>
                    </div>
                    <div class="SheetCo2">
                      <input class="SheetInput" type="text" v-model="item.default" :disabled="editTemplate.locked || item.name==='name'" @focus="onFocusMode()" @blur="noFocusMode()"/>
                    </div>
                    <div class="SheetCo3" v-if="item.name!=='name'">
                      <div class="lopCo3" v-show="item.set">
                        <div class="listCo3">
                          <div class="itemCo3" :class="item.type==='text'?'pickCo3':''" @click.stop="()=>{item.type='text';item.length=100;item.set=false}">文本</div>
                          <div class="itemCo3" :class="item.type==='long'?'pickCo3':''" @click.stop="()=>{item.type='long';item.length=1000;item.set=false}">长文本</div>
                          <div class="itemCo3" :class="item.type==='number'?'pickCo3':''" @click.stop="()=>{item.type='number';item.length=14;item.set=false}">数字</div>
                          <div class="itemCo3" :class="item.type==='date'?'pickCo3':''" @click.stop="()=>{item.type='date';item.length=0;item.set=false}">日期</div>
                          <div class="itemCo3" :class="item.type==='bool'?'pickCo3':''" @click.stop="()=>{item.type='bool';item.length=0;item.set=false}">布尔</div>
                          <div class="itemCo3" :class="item.type==='list'?'pickCo3':''" @click.stop="()=>{item.type='list';item.length=0;item.set=false}">列表</div>
                          <div class="itemCo3" :class="item.type==='percent'?'pickCo3':''" @click.stop="()=>{item.type='percent';item.length=0;item.set=false}">百分比</div>
                          <div class="itemCo3" :class="item.type==='score'?'pickCo3':''" @click.stop="()=>{item.type='score';item.length=10;item.set=false}">评分</div>
                          <div class="itemCo3" style="color:#1ba903" @click.stop="()=>{item.set=false}">返回</div>
                        </div>
                      </div>
                      <div class="inputCo3" v-show="!item.set">
                        {{item.type}}
                      </div>
                      <div class="iconCo3" @click="item.set=true" v-show="!item.set && editTemplate.locked===false">
                        <dropdown-button></dropdown-button>
                      </div>
                      <div class="iconCo3" @click="alertTip('请先解锁模板')" v-show="editTemplate.locked===true">
                        <dropdown-button></dropdown-button>
                      </div>
                    </div>
                    <div class="SheetCo3" v-if="item.name==='name'">
                      <div class="lopCo3" v-show="item.set">
                        <div class="listCo3">
                          <div class="itemCo3" :class="item.type==='text'?'pickCo3':''" @click.stop="()=>{item.type='text';item.set=false}">文本</div>
                          <div class="itemCo3" style="color:#1ba903" @click.stop="()=>{item.set=false}">返回</div>
                        </div>
                      </div>
                      <div class="inputCo3" v-show="!item.set">
                        {{item.type}}
                      </div>
                      <div class="iconCo3" @click="item.set=true" v-show="!item.set && editTemplate.locked===false">
                        <dropdown-button></dropdown-button>
                      </div>
                      <div class="iconCo3" @click="alertTip('请先解锁模板')" v-show="editTemplate.locked===true">
                        <dropdown-button></dropdown-button>
                      </div>
                    </div>
                    <div class="SheetCo4">
                      <input class="SheetInput" type="number" v-model.number="item.length" :disabled="editTemplate.locked || item.name==='name'" @focus="onFocusMode()" @blur="noFocusMode()"/>
                    </div>
                    <div class="SheetCo5">
                      <input type="checkbox" :checked="item.empty" v-model="item.empty" :disabled="editTemplate.locked || item.name==='name'" @focus="onFocusMode()" @blur="noFocusMode()"/>
                    </div>
                  </div>
                  <div class="SheetRow">
                    <div class="RowButton" @click="addDetailsRule()">Add New ✚</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="templateNifty" v-if="templateNifty===5">
            <div class="TContent">
              <div class="setList">
                <div class="setTitle">
                  设置颜色规则
                </div>
                <div class="setExplain">
                  通过依据某项属性自动为成员设置颜色。注意：在点击“应用”之前都可以再次修改此项规则，一旦点击了“应用”之后，此分组内的所有子分组会被释放，所有元素成员将会被按颜色重新分组，并且此分组将无法手动调整元素成员顺序，也无法手动新建子分组。
                </div>
                <div class="setTitle">
                  颜色依据
                </div>
                <div class="setExplain">
                  点击下方按钮选择其中一个属性作为颜色的依据。
                </div>
                <div class="setChoice">
                  <select name="colorsAoe" v-model="editTemplate.colorRule.basis" :disabled="editTemplate.locked" :title="'当前依据属性类型：'+editTemplate.colorRule.type" @change="changeColorRuleBasis()">
                    <option :value="item.name" v-if="item.type!=='long' && item.name!==''" v-for="item in editTemplate.detailsRule">{{item.name}}</option>
                  </select>
                  <br/>
                </div>
                <div class="setTitle">
                  条件规则
                </div>
                <div class="setExplain">
                  在下方的表格中，点击添加和修改颜色的条件规则。
                </div>
                <div class="detailsSheet">
                  <div class="SheetRow RowTitle">
                    <div class="SheetCo0" title="点击切换为删除模式" @click="switchDelMod2=true" v-show="!switchDelMod2">
                      <trash-can></trash-can>
                    </div>
                    <div class="SheetCo0" title="点击切换为排序模式" @click="switchDelMod2=false" v-show="switchDelMod2">
                      <arrow-up></arrow-up>
                    </div>
                    <div class="SheetCo7">
                      类型
                    </div>
                    <div class="SheetCo8">
                      参数
                    </div>
                    <div class="SheetCo9">
                      颜色
                    </div>
                  </div>
                  <div class="SheetRow RowText" v-for="(item,index) in editTemplate.colorRule.condition">
                    <div class="SheetCo0">
                      <span @click.stop="colorUp(index)" v-show="!switchDelMod2"><arrow-up></arrow-up></span>
                      <span @click.stop="colorDown(index)" v-show="!switchDelMod2"><arrow-down></arrow-down></span>
                      <span @click.stop="deleteColor(index)" v-show="switchDelMod2"><trash-can></trash-can></span>
                    </div>
                    <div class="SheetCo7">
                      <div class="lopCo3" v-show="item.set">
                        <div class="listCo3">
                          <div class="itemCo3" v-for="(nn,oo) in allowType2Color" :class="item.method===oo?'pickCo3':''" @click.stop="()=>{item.method=oo;item.set=false}">{{nn}}</div>
                          <div class="itemCo3" style="color:#1ba903" @click.stop="()=>{item.set=false}">返回</div>
                        </div>
                      </div>
                      <div class="inputCo3" v-show="!item.set">
                        {{item.method}}
                      </div>
                      <div class="iconCo3" @click="item.set=true" v-show="!item.set && editTemplate.locked===false">
                        <dropdown-button></dropdown-button>
                      </div>
                      <div class="iconCo3" @click="alertTip('请先解锁模板')" v-show="editTemplate.locked===true">
                        <dropdown-button></dropdown-button>
                      </div>
                    </div>
                    <div class="SheetCo8">
                      <input class="SheetInput" type="text" v-model="item.value" :disabled="editTemplate.locked" @focus="onFocusMode()" @blur="noFocusMode()"/>
                    </div>
                    <div class="SheetCo9">
                      <input class="inpCo9" type="color" v-model="item.color" :disabled="editTemplate.locked"/>
                      <div class="colCo9">
                        <div class="lisCo9" v-for="color in colors" :style="'background:'+color" @click="()=>{if(!editTemplate.locked)item.color=color}"></div>
                      </div>
                    </div>
                  </div>
                  <div class="SheetRow" v-show="editTemplate.colorRule.condition.length===0">
                    <div class="RowEmpty" @click="addColorRule()" >Empty rule Click to add ✚</div>
                  </div>
                  <div class="SheetRow" v-show="editTemplate.colorRule.condition.length!==0">
                    <div class="RowButton" @click="addColorRule()">Add new rule ✚</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="templateNifty" v-if="templateNifty===6">
            <div class="TContent">
              <div class="setList">
                <div class="setTitle">
                  设置宽度规则
                </div>
                <div class="setExplain">
                  通过依据某项属性自动为成员设置宽度。注意：在点击“应用”之前都可以再次修改此项规则，一旦点击了“应用”之后，此分组内的所有元素将会按下面的规则重新设置宽度。
                </div>
                <div class="setTitle">
                  宽度依据
                </div>
                <div class="setExplain">
                  点击下方按钮选择其中一个属性作为宽度的依据。
                </div>
                <div class="setChoice">
                  <select name="colorsAoe" v-model="editTemplate.widthRule.basis" :disabled="editTemplate.locked" :title="'当前依据属性类型：'+editTemplate.widthRule.type" @change="changeWidthRuleBasis()">
                    <option :value="item.name" v-if="item.type!=='long' && item.name!==''" v-for="item in editTemplate.detailsRule">{{item.name}}</option>
                  </select>
                  <br/>
                </div>
                <div class="setTitle">
                  条件规则
                </div>
                <div class="setExplain">
                  在下方的表格中，点击添加和修改宽度的条件规则。
                </div>
                <div class="detailsSheet">
                  <div class="SheetRow RowTitle">
                    <div class="SheetCo0" title="点击切换为删除模式" @click="switchDelMod3=true" v-show="!switchDelMod3">
                      <trash-can></trash-can>
                    </div>
                    <div class="SheetCo0" title="点击切换为排序模式" @click="switchDelMod3=false" v-show="switchDelMod3">
                      <arrow-up></arrow-up>
                    </div>
                    <div class="SheetCo7">
                      类型
                    </div>
                    <div class="SheetCo8">
                      参数
                    </div>
                    <div class="SheetCo9">
                      宽度
                    </div>
                  </div>
                  <div class="SheetRow RowText" v-for="(item,index) in editTemplate.widthRule.condition">
                    <div class="SheetCo0">
                      <span @click.stop="widthUp(index)" v-show="!switchDelMod3"><arrow-up></arrow-up></span>
                      <span @click.stop="widthDown(index)" v-show="!switchDelMod3"><arrow-down></arrow-down></span>
                      <span @click.stop="deleteWidth(index)" v-show="switchDelMod3"><trash-can></trash-can></span>
                    </div>
                    <div class="SheetCo7">
                      <div class="lopCo3" v-show="item.set">
                        <div class="listCo3">
                          <div class="itemCo3" v-for="(nn,oo) in allowType2Width" :class="item.method===oo?'pickCo3':''" @click.stop="()=>{item.method=oo;item.set=false}">{{nn}}</div>
                          <div class="itemCo3" style="color:#1ba903" @click.stop="()=>{item.set=false}">返回</div>
                        </div>
                      </div>
                      <div class="inputCo3" v-show="!item.set">
                        {{item.method}}
                      </div>
                      <div class="iconCo3" @click="item.set=true" v-show="!item.set && editTemplate.locked===false">
                        <dropdown-button></dropdown-button>
                      </div>
                      <div class="iconCo3" @click="alertTip('请先解锁模板')" v-show="editTemplate.locked===true">
                        <dropdown-button></dropdown-button>
                      </div>
                    </div>
                    <div class="SheetCo8">
                      <input class="SheetInput" type="text" v-model="item.value" :disabled="editTemplate.locked" @focus="onFocusMode()" @blur="noFocusMode()"/>
                    </div>
                    <div class="SheetCo9">
                      <input class="inpCo9" type="number" min="2" max="15" v-model.number="item.width" :disabled="editTemplate.locked"/>
                      <div class="widCo9">
                        <span  @click="()=>{if(!editTemplate.locked)item.width=2}">2</span>
                        <span  @click="()=>{if(!editTemplate.locked)item.width=4}">4</span>
                        <span  @click="()=>{if(!editTemplate.locked)item.width=8}">8</span>
                        <span  @click="()=>{if(!editTemplate.locked)item.width=12}">12</span>
                        <span  @click="()=>{if(!editTemplate.locked)item.width=15}">15</span>
                      </div>
                    </div>
                  </div>
                  <div class="SheetRow" v-show="editTemplate.widthRule.condition.length===0">
                    <div class="RowEmpty" @click="addWidthRule()" >Empty rule Click to add ✚</div>
                  </div>
                  <div class="SheetRow" v-show="editTemplate.widthRule.condition.length!==0">
                    <div class="RowButton" @click="addWidthRule()">Add new rule ✚</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="templateBottom">
        <button @click.stop="niftyBack()">Back</button>
        <button @click.stop="niftyNext()">Next</button>
        <button @click.stop="closeAndCancel()">Cancel</button>
        <button @click.stop="submitEdit()">Submit</button>
      </div>
    </div>
    <div class="templateMenuClose"  @click.stop="closeAndCancel()"  v-if="templateShow">

    </div>
    <pomelo-confirm
      :view="firmView"
      :plan="firmPlan"
      :message="firmMessage"
      @confirm="handleConfirm">
    </pomelo-confirm>
  </div>
</template>

<script>
import ArrowDown from "./svgValidIcons/arrowDown";
import ArrowUp from "./svgValidIcons/arrowUp";
import DropdownButton from "./svgValidIcons/dropdownButton";
import TrashCan from "./svgValidIcons/trashCan";
import PomeloConfirm from "./PomeloConfirm";
export default {
  name: "BananaTemplateEdit",
  components:{
    DropdownButton,ArrowUp,ArrowDown,TrashCan,PomeloConfirm
  },
  data(){
    return{
      colors:['#cc0066','#ff6666',
        '#ff6600','#ffcc33',
        '#ffff00','#99cc33',
        '#66cc33','#009966',
        '#009999','#0099cc',
        '#333399','#993399',
        '#666633', '#993300',
        '#ff6600','#ffcc00',
        '#996600','#669933',
        '#006633','#006699',
        '#333366','#6633cc',
        '#cccccc','#666666',
        '#333333','#000000'],
      templateShow:false,//模板设置显示
      templateNifty:1,//模板左侧显示页序号
      niftyList:[
        '模板使用方法','模板状态','设置基本类型',
        '设置属性规则', '设置颜色规则','设置宽度规则'
      ],
      localTemplate:[//本地模板
        {
          use:false,
          id:'100000',
          name:'空的模板',
          creator:'Emilia-t',
          modify:'Wed Mar 06 2024 07:50:50 GMT+0800',
          locked:true,
          explain:'空的模板',
          viewColor:'#2c2d2c',//可视化模板样式
          viewFontSize:'14px',
          viewBackground:'#ffffff',
          viewBoxShadow:'0px 0px 5px #b6b6b6',
          viewBorder:'1px solid #e1e1e1',
          viewRadius:'2px',
          typeRule:{point:true,line:true,area:true,curve:true},//模板规则
          detailsRule:[
            {set:false,name:'name',default:'unknown',type:'text',length:100,empty:true}
          ],
          colorRule:{
            basis:'',type:'',
            condition:[

            ]
          },
          widthRule:{
            basis:'',type:'',
            condition:[

            ]
          }
        },
        {
          use:false,
          id:'111111',
          name:'标准的模板',
          creator:'Emilia-t',
          modify:'Wed Mar 06 2024 07:50:50 GMT+0800',
          locked:true,
          explain:'标准的模板',
          viewColor:'#2c2d2c',//可视化模板样式
          viewFontSize:'14px',
          viewBackground:'#f2fcff',
          viewBoxShadow:'0px 0px 5px #cffbff',
          viewBorder:'1px solid #e1e1e1',
          viewRadius:'2px',
          typeRule:{point:true,line:true,area:true,curve:true},//模板规则
          detailsRule:[
            {set:false,name:'name',default:'unknown',type:'text',length:100,empty:true},
            {set:false,name:'grade',default:'unknown',type:'text',length:100,empty:true},
            {set:false,name:'region',default:'unknown',type:'text',length:100,empty:true},
            {set:false,name:'address',default:'unknown',type:'text',length:100,empty:true},
            {set:false,name:'telephone',default:'unknown',type:'text',length:100,empty:true}
          ],
          colorRule:{
            basis:'grade',
            type:'text',
            condition:[
              {set:false, method: 'equ', value: 'demo', color: '#009966'},
              {set: false, method: 'equ', value: 'stress', color: '#ffcc33'},
              {set: false, method: 'equ', value: 'initial', color: '#ff6666'}
            ]
          },
          widthRule:{
            basis:'region',
            type:'text',
            condition: [
              {set: false, method: 'equ', value: 'inside', width: 6},
              {set: false, method: 'equ', value: 'inside', width: 2}
            ]
          }
        },
        {
          use:false,
          id:'222222',
          name:'公共园区模板(next_)',
          creator:'Emilia-t',
          modify:'Wed Mar 06 2024 07:50:50 GMT+0800',
          locked:true,
          explain:'公共园区模板',
          viewColor:'#047804',//可视化模板样式
          viewFontSize:'14px',
          viewBackground:'#afffd0',
          viewBoxShadow:'0px 0px 5px #a2cb4c',
          viewBorder:'1px solid #e1e1e1',
          viewRadius:'2px',
        },
        {
          use:false,
          id:'333333',
          name:'铁路交通模板',
          creator:'Emilia-t',
          modify:'Wed Mar 06 2024 07:50:50 GMT+0800',
          locked:true,
          explain:'铁路交通模板',
          viewColor:'#ffffff',//可视化模板样式
          viewFontSize:'14px',
          viewBackground:'#5e5e5e',
          viewBoxShadow:'0px 0px 5px #909090',
          viewBorder:'1px dashed #ffffff',
          viewRadius:'2px',
        },
        {
          use:false,
          id:'444444',
          name:'旅游景点模板',
          creator:'Emilia-t',
          modify:'Wed Mar 06 2024 07:50:50 GMT+0800',
          locked:true,
          explain:'旅游景点模板',
          viewColor:'#b58f02',//可视化模板样式
          viewFontSize:'14px',
          viewBackground:'#ffeac8',
          viewBoxShadow:'0px 0px 5px #f8d2d2',
          viewBorder:'1px solid #ffe7e7',
          viewRadius:'2px',
        },
      ],
      taskCode:0,
      editTemplate:{
        id:'',
        name:'',
        creator:'',
        modify:'',
        locked:false,
        explain:'',
        typeRule:{
          point:true,
          line:true,
          area:true,
          curve:true
        },
        detailsRule:[
          {
            set:false,
            name:'name',
            default:'unknown',
            type:'text',
            length:100,
            empty:true
          }
        ],
        colorRule:{
          basis:'',
          type:'',
          condition:[]
        },
        widthRule:{
          basis:'',
          type:'',
          condition:[]
        }
      },
      switchDelMod1:false,
      switchDelMod2:false,
      switchDelMod3:false,
      firmView:false,//确认菜单
      firmPlan:{},
      firmMessage:'',
    }
  },
  mounted() {

  },
  methods:{
    niftyBack(){//上一步骤
      if(this.templateNifty===1)return false;
      this.templateNifty--
    },
    niftyNext(){//下一步骤
      if(this.templateNifty===6)return false;
      this.templateNifty++
    },
    handleConfirm(plan){//一些需要再次确认才能执行的操作
      if(!plan.state){//取消执行
        this.firmView=false;//关闭确认菜单
        return false;
      }
      this.firmView=false;//关闭确认菜单
      let method=plan.method;
      let value=plan.value;
      switch(method){
        case 'useLocalTemplate':{//使用本地模板覆盖之前的模板
          this.localTemplate.forEach((item)=>{
            item.use=item.id===value;
            if(item.id===value){
              item.use=true;
              this.editTemplate.name=item.name;
              this.editTemplate.locked=item.locked;
              this.editTemplate.explain=item.explain;
              this.editTemplate.typeRule=item.typeRule;
              this.editTemplate.detailsRule=item.detailsRule;
              this.editTemplate.colorRule=item.colorRule;
              this.editTemplate.widthRule=item.widthRule;
            }else {
              item.use=false;
            }
          });
          break;
        }
        case 'submitEdit':{
          let creator=this.userName+'('+this.userEmail+')';
          let time=this.getFormattedDate();
          if(this.editTemplate.creator==='' || this.editTemplate.creator===null){
            this.editTemplate.creator=creator;
          }
          this.editTemplate.modify=time;
          let template=this.editTemplate;
          let ckCode=this.tpCheck(template);
          if(ckCode!==true){
            let text='';
            text=this.codeExplain(ckCode,false);
            this.$store.commit('setCoLogMessage',{text:text,from:'internal:BananaTemplateEdit',type:'tip'});
            return false;
          }else {
            let product={
              template,
              code:this.taskCode
            };
            this.$store.commit('setCoTemplateSubmit',product);
            this.$store.commit('setCoLogMessage',{text:'模板更新已提交',from:'internal:BananaTemplateEdit',type:'tip'});
            this.templateShow=false;
            this.resetUI();
          }
          break;
        }
      }
    },
    resetUI(){//还原部分UI界面
      this.templateNifty=1;//还原模板设置页面左侧的按钮
      for(let i=0;i<this.localTemplate.length;i++){//还原快速应用模板的界面
        this.localTemplate[i].use=false;
      }
    },
    getFormattedDate() {//获取模板时间
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const date = new Date();
       const day = days[date.getDay()];
      const month = months[date.getMonth()];
      const dayOfMonth = date.getDate();
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      const timeZoneOffset = -date.getTimezoneOffset();// 获取时区偏移量，转换为小时
      const offsetSign = timeZoneOffset >= 0 ? '+' : '-';
      const offsetHours = String(Math.floor(Math.abs(timeZoneOffset) / 60)).padStart(2, '0');
      const offsetMinutes = String(Math.abs(timeZoneOffset) % 60).padStart(2, '0');
      const timeZone = `GMT${offsetSign}${offsetHours}${offsetMinutes}`;
      return `${day} ${month} ${dayOfMonth.toString().padStart(2, '0')} ${year} ${hours}:${minutes}:${seconds} ${timeZone}`;
    },
    lockUnlock(){
      this.editTemplate.locked=!this.editTemplate.locked;
    },
    submitEdit(){
      let s1=JSON.stringify(this.editTemplate);
      let s2=JSON.stringify(this.EditBackup);
      if(s1===s2){
        this.$store.commit('setCoLogMessage',{text:'没有任何变动',from:'internal:BananaTemplateEdit',type:'tip'});
        return false;
      }
      this.firmPlan={method:'submitEdit',value:null};
      this.firmMessage='即将更新模板，是否要继续？';
      this.firmView=true;//呼出确认菜单
    },
    changeWidthRuleBasis(){
      if(this.editTemplate.widthRule.basis===null
        || this.editTemplate.widthRule.basis===''
      ){
        return false;
      }
      let type='text';
      let basis=this.editTemplate.widthRule.basis;
      let len=this.editTemplate.detailsRule.length;
      for(let i=0;i<len;i++){//调整widthRule.type
        if(basis===this.editTemplate.detailsRule[i].name){
          type=this.editTemplate.detailsRule[i].type;
          break;
        }
      }
      this.editTemplate.widthRule.type=type;
      let condition=[];
      len=this.editTemplate.widthRule.condition.length;
      for(let q=0;q<len;q++){//过滤不可用的规则
        if(type==='bool' || type==='list' || type==='text'){
          if(this.editTemplate.widthRule.condition[q].method==='equ' || this.editTemplate.widthRule.condition[q].method==='nequ'){
            condition.push(this.editTemplate.widthRule.condition[q]);
          }
        }
        else if(type==='percent' || type==='date'){
          if(this.editTemplate.widthRule.condition[q].method==='equ' || this.editTemplate.widthRule.condition[q].method==='nequ'
            || this.editTemplate.widthRule.condition[q].method==='gre' || this.editTemplate.widthRule.condition[q].method==='greq'
            || this.editTemplate.widthRule.condition[q].method==='les' || this.editTemplate.widthRule.condition[q].method==='lesq'
          ){
            condition.push(this.editTemplate.widthRule.condition[q]);
          }
        }else if(type==='score' || type==='number'){
          condition.push(this.editTemplate.widthRule.condition[q]);
        }
      }
      this.editTemplate.widthRule.condition=condition;
    },
    changeColorRuleBasis(){
      if(this.editTemplate.colorRule.basis===null
      || this.editTemplate.colorRule.basis===''
      ){
        return false;
      }
      let type='text';
      let basis=this.editTemplate.colorRule.basis;
      let len=this.editTemplate.detailsRule.length;
      let condition=[];
      for(let i=0;i<len;i++){//调整colorRule.type
        if(basis===this.editTemplate.detailsRule[i].name){
          type=this.editTemplate.detailsRule[i].type;
          break;
        }
      }
      this.editTemplate.colorRule.type=type;
      len=this.editTemplate.colorRule.condition.length;
      for(let q=0;q<len;q++){//过滤不可用的规则
        if(type==='bool' || type==='list' || type==='text'){
          if(this.editTemplate.colorRule.condition[q].method==='equ' || this.editTemplate.colorRule.condition[q].method==='nequ'){
            condition.push(this.editTemplate.colorRule.condition[q]);
          }
        }
        else if(type==='percent' || type==='date'){
          if(this.editTemplate.colorRule.condition[q].method==='equ' || this.editTemplate.colorRule.condition[q].method==='nequ'
          || this.editTemplate.colorRule.condition[q].method==='gre' || this.editTemplate.colorRule.condition[q].method==='greq'
          || this.editTemplate.colorRule.condition[q].method==='les' || this.editTemplate.colorRule.condition[q].method==='lesq'
          ){
            condition.push(this.editTemplate.colorRule.condition[q]);
          }
        }else if(type==='score' || type==='number'){
          condition.push(this.editTemplate.colorRule.condition[q]);
        }
      }
      this.editTemplate.colorRule.condition=condition;
    },
    onFocusMode(){//聚焦模式
      this.$store.state.mapConfig.inputFocusStatus=true;
    },
    noFocusMode(){//非聚焦模式
      this.$store.state.mapConfig.inputFocusStatus=false;
    },
    closeAndCancel(){
      this.templateShow=false;
      this.resetUI();
      this.$store.commit('setCoTemplateCancel',this.taskCode);
    },
    widthUp(index){
      if(this.editTemplate.locked){this.alertTip('请先解锁模板');return false;}
      if(index===0){
        this.$store.commit('setCoLogMessage',{text:'已经在最上方了',from:'internal:BananaTemplateEdit',type:'tip'});
        return false;
      }
      let temp=this.editTemplate.widthRule.condition[index];
      this.editTemplate.widthRule.condition[index]=this.editTemplate.widthRule.condition[index-1];
      this.editTemplate.widthRule.condition[index-1]=temp;
      this.editTemplate.widthRule.condition.push(null);
      this.editTemplate.widthRule.condition.pop();
    },
    widthDown(index){
      if(this.editTemplate.locked){this.alertTip('请先解锁模板');return false;}
      if(index+1>=this.editTemplate.widthRule.condition.length){
        this.$store.commit('setCoLogMessage',{text:'已经在最下方了',from:'internal:BananaTemplateEdit',type:'tip'});
        return false;
      }
      let temp=this.editTemplate.widthRule.condition[index];
      this.editTemplate.widthRule.condition[index]=this.editTemplate.widthRule.condition[index+1];
      this.editTemplate.widthRule.condition[index+1]=temp;
      this.editTemplate.widthRule.condition.push(null);
      this.editTemplate.widthRule.condition.pop();
    },
    deleteWidth(index){
      if(this.editTemplate.locked){this.alertTip('请先解锁模板');return false;}
      if(index>=this.editTemplate.widthRule.condition.length || index<0){
        return false;
      }
      this.editTemplate.widthRule.condition.splice(index,1);
    },
    colorUp(index){
      if(this.editTemplate.locked){this.alertTip('请先解锁模板');return false;}
      if(index===0){
        this.$store.commit('setCoLogMessage',{text:'已经在最上方了',from:'internal:BananaTemplateEdit',type:'tip'});
        return false;
      }
      let temp=this.editTemplate.colorRule.condition[index];
      this.editTemplate.colorRule.condition[index]=this.editTemplate.colorRule.condition[index-1];
      this.editTemplate.colorRule.condition[index-1]=temp;
      this.editTemplate.colorRule.condition.push(null);
      this.editTemplate.colorRule.condition.pop();
    },
    colorDown(index){
      if(this.editTemplate.locked){this.alertTip('请先解锁模板');return false;}
      if(index+1>=this.editTemplate.colorRule.condition.length){
        this.$store.commit('setCoLogMessage',{text:'已经在最下方了',from:'internal:BananaTemplateEdit',type:'tip'});
        return false;
      }
      let temp=this.editTemplate.colorRule.condition[index];
      this.editTemplate.colorRule.condition[index]=this.editTemplate.colorRule.condition[index+1];
      this.editTemplate.colorRule.condition[index+1]=temp;
      this.editTemplate.colorRule.condition.push(null);
      this.editTemplate.colorRule.condition.pop();
    },
    deleteColor(index){
      if(this.editTemplate.locked){this.alertTip('请先解锁模板');return false;}
      if(index>=this.editTemplate.colorRule.condition.length || index<0){
        return false;
      }
      this.editTemplate.colorRule.condition.splice(index,1);
    },
    switchTemplateNifty(serial){//切换模板右侧页面
      this.templateNifty=serial;
    },
    useLocalTemplate(id){//选择本地的模板
      if(this.editTemplate.locked){this.alertTip('请先解锁模板');return false;}
      this.firmPlan={method:'useLocalTemplate',value:id};
      this.firmMessage='即将覆盖当前编辑，是否要继续？';
      this.firmView=true;//呼出确认菜单
    },
    allowType(type){//更改模板
      if(this.editTemplate.locked){
        this.alertTip('请先解锁模板');return false;
      }
      let ct=0;
      for(let i in this.editTemplate.typeRule){
        if(this.editTemplate.typeRule.hasOwnProperty(i)){
          if(this.editTemplate.typeRule[i]===true){
            ct++;
          }
        }
      }
      if(ct<=1 && this.editTemplate.typeRule[type]===true){
        this.alertTip('至少需要允许一种');return false;
      }
      this.editTemplate.typeRule[type]=!this.editTemplate.typeRule[type];
    },
    deleteDetails(index){
      if(this.editTemplate.locked){this.alertTip('请先解锁模板');return false;}
      if(index>=this.editTemplate.detailsRule.length || index<0){
        return false;
      }
      if(this.editTemplate.detailsRule.length<=1){
        this.$store.commit('setCoLogMessage',{text:'至少需要保留一个属性',from:'internal:BananaTemplateEdit',type:'tip'});
        return false;
      }
      if(this.editTemplate.detailsRule[index].name==='name'){
        this.$store.commit('setCoLogMessage',{text:'不能删除name属性',from:'internal:BananaTemplateEdit',type:'tip'});
        return false;
      }
      this.editTemplate.detailsRule.splice(index,1);
    },
    detailsDown(index){
      if(this.editTemplate.locked){this.alertTip('请先解锁模板');return false;}
      if(index+1>=this.editTemplate.detailsRule.length){
        this.$store.commit('setCoLogMessage',{text:'已经在最下方了',from:'internal:BananaTemplateEdit',type:'tip'});
        return false;
      }
      let temp=this.editTemplate.detailsRule[index];
      this.editTemplate.detailsRule[index]=this.editTemplate.detailsRule[index+1];
      this.editTemplate.detailsRule[index+1]=temp;
      this.editTemplate.detailsRule.push(null);
      this.editTemplate.detailsRule.pop();
    },
    detailsUp(index){
      if(this.editTemplate.locked){this.alertTip('请先解锁模板');return false;}
      if(index===0){
        this.$store.commit('setCoLogMessage',{text:'已经在最上方了',from:'internal:BananaTemplateEdit',type:'tip'});
        return false;
      }
      let temp=this.editTemplate.detailsRule[index];
      this.editTemplate.detailsRule[index]=this.editTemplate.detailsRule[index-1];
      this.editTemplate.detailsRule[index-1]=temp;
      this.editTemplate.detailsRule.push(null);
      this.editTemplate.detailsRule.pop();
    },
    addDetailsRule(){
      if(this.editTemplate.locked){this.alertTip('请先解锁模板');return false;}
      let obj=Object.create(null);
      obj.set=false;
      obj.name='';
      obj.default='unknown';
      obj.type='text';
      obj.length=100;
      obj.empty=true;
      this.editTemplate.detailsRule.push(obj);
    },
    addWidthRule(){
      if(this.editTemplate.locked){this.alertTip('请先解锁模板');return false;}
      if(this.editTemplate.widthRule.basis===null || this.editTemplate.widthRule.method===null){this.alertTip('请先选择宽度依据');return false;}
      let obj=Object.create(null);
      obj.set=false;
      obj.method='equ';
      obj.value='0';
      obj.width=2;
      this.editTemplate.widthRule.condition.push(obj);
    },
    addColorRule(){
      if(this.editTemplate.locked){this.alertTip('请先解锁模板');return false;}
      if(this.editTemplate.colorRule.basis===null || this.editTemplate.colorRule.method===null){this.alertTip('请先选择颜色依据');return false;}
      let obj=Object.create(null);
      obj.set=false;
      obj.method='equ';
      obj.value='0';
      obj.color='#000000';
      this.editTemplate.colorRule.condition.push(obj);
    },
    createTemplateId(){//创建模板ID
      const validChars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const length = Math.floor(Math.random() * 7) + 8;//先生成一个[0,7)的随机数，然后加上8
      let array = new Uint8Array(length);//输出长度为随机的8-14位
      window.crypto.getRandomValues(array);
      let result = '';
      array.forEach((byte) => {
        result += validChars.charAt(byte % validChars.length);
      });
      return result;
    },
    alertTip(text){
      this.$store.commit('setCoLogMessage',{text:text,from:'internal:BananaTemplateEdit',type:'warn'});
    },
    viewBoxStyle(obj){
      return {
        color:obj.viewColor,
        fontSize:obj.viewFontSize,
        background:obj.viewBackground,
        boxShadow:obj.viewBoxShadow,
        border:obj.viewBorder,
        borderRadius:obj.viewRadius
      }
    },
    tpRepair(){
      this.$store.commit('setCoLogMessage',{text:'暂不支持修复',from:'internal:BananaTemplateEdit',type:'warn'});
    },
    tpManualCheck(){
      let checkCode=this.tpCheck(this.editTemplate);
      if(checkCode!==true){
        let text='';
        text=this.codeExplain(checkCode);
        this.$store.commit('setCoLogMessage',{text:'模板存在异常：'+text,from:'internal:BananaTemplateEdit',type:'warn'});
        this.tpRepair();
      }else {
        this.$store.commit('setCoLogMessage',{text:'模板检查结果：正常',from:'internal:BananaTemplateEdit',type:'tip'});
      }
    },
    /**
     * tpCheck
    */
    isInteger(value){//判断一个数字是否为正整数
      return Number.isInteger(value) && value>0;
    },
    isColor16(color){//检测一个字符串是否是标准的16进制颜色-正确则返回true
      const regex=/^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
      return regex.test(color);
    },
    isAllowValueTyp(type,value){//依据type检测value(或default)是否是正确的type类型-正确则返回true
      switch (type) {
        case 'text':{
          return typeof value==='string';
        }
        case 'long':{
          return typeof value==='string';
        }
        case 'number':{
          return typeof value === 'number';
        }
        case 'date':{
          return typeof value === 'string';
        }
        case 'bool':{
          return typeof value === 'boolean';
        }
        case 'list':{
          return typeof value === 'string';
        }
        case 'percent':{
          if(typeof value!=='string')return false;
          const reg=/^\d+(\.\d+)?%$/;
          return reg.test(value);
        }
        case 'score':{
          if(typeof value!=='number')return false;
        }
      }
    },
    isAllowMethod(type,method){//判断method是否为type允许使用的方法-正确则返回true
      switch (type){
        case 'long':{
          return false;
        }
        case 'score':{
          return ['equ','nequ','gre','greq','les','lesq','mod0','nmod0'].includes(method);
        }
        case 'number':{
          return ['equ','nequ','gre','greq','les','lesq','mod0','nmod0'].includes(method);
        }
        case 'percent':{
          return ['equ','nequ','gre','greq','les','lesq'].includes(method);
        }
        case 'date':{
          return ['equ','nequ','gre','greq','les','lesq'].includes(method);
        }
        case 'bool':{
          return ['equ','nequ'].includes(method);
        }
        case 'list':{
          return ['equ','nequ'].includes(method);
        }
        case 'text':{
          return ['equ','nequ'].includes(method);
        }
        default:{
          return false;
        }
      }
    },
    isAllowValueTypL(type,length,value){//依据type length检测value(或default)是否是type类型的数据以及长度是否合理-正确则返回true
      switch (type) {
        case 'text':{
          if(typeof value!=='string')return false;
          return value.length <= length;
        }
        case 'long':{
          if(typeof value!=='string')return false;
          return value.length <= length;
        }
        case 'number':{
          return typeof value === 'number';
        }
        case 'date':{
          return typeof value === 'string';
        }
        case 'bool':{
          return typeof value === 'boolean';
        }
        case 'list':{
          return typeof value === 'string';
        }
        case 'percent':{
          if(typeof value!=='string')return false;
          const reg=/^\d+(\.\d+)?%$/;
          return reg.test(value);
        }
        case 'score':{
          if(typeof value!=='number')return false;
          return value <= length;
        }
      }
    },
    isAllowTypeLen(type,num){//检测num是否超过type规定的最大长度-正确则返回true
      if(num<0)return false;
      switch (type) {
        case 'text':{
          return num <= 100;
        }
        case 'long':{
          return num <= 1000;
        }
        case 'score':{
          return num <= 10;
        }
        default:{
          return num === 0;
        }
      }
    },
    isDetailsType(str){//检测str是否为模板属性规定以内的类型-正确则返回true
      return ['text','long','number','date','bool','list','percent','score'].includes(str);
    },
    isNameDetails(obj){//检测是否obj是默认的name属性-正确则返回true
      let obj1={
        set:false,
        name:'name',
        default:'unknown',
        type:'text',
        length:100,
        empty:true
      };
     const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj);
      if (keys1.length !== keys2.length) {
       return false;
     }
      for (let key of keys1) {
        if (obj1[key] !== obj[key]) {
         return false;
        }
     }
      return true;
    },
    codeExplain(code,english){//错误代码的解释
      let A=code%100;
      let B=(code-A);
      switch (B){
        case 500:{return english?'Template is null':'模板为空';}
        case 1000:{return english?'Template is not an object':'模板不是一个对象';}
        case 2000:{return english?'Template missing id attribute':'模板缺失id属性';}//A layer property check
        case 2100:{return english?'Template id value type error':'模板id值类型错误';}
        case 2200:{return english?'Template id value cannot be empty':'模板id值不能为空字符';}

        case 4000:{return english?'Template missing name attribute':'模板缺失name属性';}
        case 4100:{return english?'Template name value type error':'模板名称值类型错误';}
        case 4200:{return english?'Template name value cannot be empty':'模板名称值不能为空字符';}

        case 6000:{return english?'Template missing creator attribute':'模板缺失creator属性';}
        case 6100:{return english?'Template creator value type error':'模板创建者值类型错误';}
        case 6200:{return english?'Template creator value cannot be empty':'模板创建者值不能为空字符';}

        case 8000:{return english?'Template missing modify attribute':'模板缺少modify属性';}
        case 8100:{return english?'Template modify value type error':'模板编辑日期值类型错误';}
        case 8200:{return english?'Template modify value cannot be empty':'模板编辑日期值不能为空';}

        case 10000: { return english ? 'Template missing locked attribute' : '模板缺失locked属性'; }
        case 10100: { return english ? 'Template locked value type error' : '模板locked值类型错误'; }

        case 12000: { return english ? 'Template missing explain attribute' : '模板缺失explain属性'; }
        case 12100: { return english ? 'Template explain value type error' : '模板描述信息值类型错误'; }

        case 14000: { return english ? 'Template missing typeRule attribute' : '模板缺失typeRule属性'; } //typeRule property check
        case 15000: { return english ? 'Template typeRule is not an object' : '模板typeRule不是一个对象'; }

        case 16000: { return english ? 'TypeRule missing point attribute' : '类型规则缺失point属性'; }
        case 17000: { return english ? 'TypeRule point value type error' : '类型规则point值类型错误'; }

        case 18000: { return english ? 'TypeRule missing line attribute' : '类型规则缺失line属性'; }
        case 19000: { return english ? 'TypeRule line value type error' : '类型规则line值类型错误'; }

        case 20000: { return english ? 'TypeRule missing area attribute' : '类型规则缺失area属性'; }
        case 21000: { return english ? 'TypeRule area value type error' : '类型规则area值类型错误'; }

        case 22000: { return english ? 'TypeRule missing curve attribute' : '类型规则缺失curve属性'; }
        case 23000: { return english ? 'TypeRule curve value type error' : '类型规则curve值类型错误'; }
        case 24000: { return english ? 'TypeRule at least one must be allowed' : '类型规则至少需要允许一个'; }

        case 30000: { return english ? 'Template missing detailsRule attribute' : '模板缺失detailsRule属性'; } //detailsRule property check
        case 30100: { return english ? 'Template detailsRule is not an array' : '模板detailsRule不是一个数组'; }
        case 30200: { return english ? 'Template detailsRule length cannot = 0' : '模板detailsRule长度不能为0'; }
        case 30300: { return english ? 'Template detailsRule length cannot > 90' : '模板detailsRule长度不能大于90'; }
        case 30400: { return english ? 'Template detailsRule first element type error' : '模板detailsRule第一个元素类型错误'; }
        case 30500: { return english ? 'Template detailsRule first element value error' : '模板detailsRule第一个元素值错误'; }

        case 31000: { return english ? 'Template detailsRule type error in:' + A + ' item' : '模板属性规则类型错误，在：' + A + '项'; }
        case 32000: { return english ? 'DetailsRule missing set attribute in:' + A + ' item' : '属性规则缺失set属性，在：' + A + '项'; }
        case 32100: { return english ? 'DetailsRule set value type error in:' + A + ' item' : '属性规则set值类型错误，在：' + A + '项'; }

        case 33000: { return english ? 'DetailsRule missing name attribute in:' + A + ' item' : '属性规则缺失name属性，在：' + A + '项'; }
        case 33100: { return english ? 'DetailsRule name value type error in:' + A + ' item' : '属性规则name值类型错误，在：' + A + '项'; }
        case 33200: { return english ? 'DetailsRule name value cannot be empty in:' + A + ' item' : '属性规则name值不能为空，在：' + A + '项'; }
        case 33300: { return english ? 'DetailsRule name value length cannot > 40 in:' + A + ' item' : '属性规则name值长度不能大于40，在：' + A + '项'; }
        case 33400: { return english ? 'DetailsRule name cannot duplicated:'+A+' item': '属性规则name值不能重复，在：' + A + '项';}

        case 34000: { return english ? 'DetailsRule missing empty attribute in:' + A + ' item' : '属性规则缺失empty属性，在：' + A + '项'; }
        case 34100: { return english ? 'DetailsRule empty value type error in:' + A + ' item' : '属性规则empty值类型错误，在：' + A + '项'; }

        case 35000: { return english ? 'DetailsRule missing type attribute in:' + A + ' item' : '属性规则缺失type属性，在：' + A + '项'; }
        case 35100: { return english ? 'DetailsRule type value type error in:' + A + ' item' : '属性规则type值类型错误，在：' + A + '项'; }
        case 35200: { return english ? 'DetailsRule type value undefined in:' + A + ' item' : '属性规则type值未定义，在：' + A + '项'; }

        case 36000: { return english ? 'DetailsRule missing length attribute in:' + A + ' item' : '属性规则缺失length属性，在：' + A + '项'; }
        case 36100: { return english ? 'DetailsRule length value type error in:' + A + ' item' : '属性规则length值类型错误，在：' + A + '项'; }
        case 36200: { return english ? 'Exceeded the allowed detailsRule length value in:' + A + ' item' : 'length超出允许的长度值，在：' + A + '项'; }

        case 37000: { return english ? 'DetailsRule missing default attribute in:' + A + ' item' : '属性规则缺失default属性，在：' + A + '项'; }
        case 37100: { return english ? 'DetailsRule default value type error in:' + A + ' item' : '属性规则default值类型错误，在：' + A + '项'; }

        case 40000: { return english ? 'Template missing colorRule attribute' : '模板缺失colorRule属性'; } //colorRule property check
        case 40100: { return english ? 'Template colorRule is not an object' : '模板颜色规则不是一个对象'; }
        case 40200: { return english ? 'ColorRule missing basis attribute' : '颜色规则缺失basis属性'; }
        case 40300: { return english ? 'ColorRule basis value type error' : '颜色规则basis值类型错误'; }
        case 40400: { return english ? 'ColorRule missing type attribute' : '颜色规则缺失type属性'; }
        case 40500: { return english ? 'ColorRule type value type error' : '颜色规则type值类型错误'; }
        case 40600: { return english ? 'ColorRule missing condition attribute' : '颜色规则缺失condition属性'; }
        case 40700: { return english ? 'ColorRule condition is not an array' : '颜色规则condition不是一个数组'; }
        case 40800: { return english ? 'If the basis is empty, the type must be empty' : '如果basis为空，则type必须为空'; }
        case 40900: { return english ? 'If the basis is empty, the condition must be an empty array' : '如果basis为空，则condition必须是一个空数组'; }
        case 41000: { return english ? 'If the basis is not empty, the type cannot be empty' : '如果basis不为空，则type不能为空'; }
        case 41100: { return english ? 'ColorRule type value not allowed' : '颜色规则type值不允许'; }
        case 41200: { return english ? 'ColorRule item length cannot > 90' : '颜色规则数量不能大于90'; }

        case 42000: { return english ? 'ColorRule item is not an object in:' + A + ' item' : '此条颜色规则不是一个对象，在：' + A + '项'; }
        case 42100: { return english ? 'ColorRule item missing set attribute in:' + A + ' item' : '此条颜色规则缺失set属性，在：' + A + '项'; }
        case 42200: { return english ? 'ColorRule item set value type error in:'+A+' item': '此条颜色规则set值类型错误，在：' + A + '项';}

        case 43000: { return english ? 'ColorRule item missing color attribute in:' + A + ' item' : '此条颜色规则缺失color属性，在：' + A + '项'; }
        case 43100: { return english ? 'ColorRule item color value type error in:' + A + ' item' : '此条颜色规则color值类型错误，在：' + A + '项'; }
        case 43200: { return english ? 'ColorRule item color value format error in:' + A + ' item' : '此条颜色规则color值格式错误，在：' + A + '项'; }

        case 44000: { return english ? 'ColorRule item missing method attribute in:' + A + ' item' : '此条颜色规则缺失method属性，在：' + A + '项'; }
        case 44100: { return english ? 'ColorRule item method value type error in:' + A + ' item' : '此条颜色规则的method值类型错误，在：' + A + '项'; }
        case 44200: { return english ? 'ColorRule item method not allowed in:' + A + ' item' : '此条颜色规则的method不合理，在：' + A + '项'; }

        case 45000: { return english ? 'ColorRule item missing value attribute in:' + A + ' item' : '此条颜色规则缺失value属性，在：' + A + '项'; }
        case 45100: { return english ? 'ColorRule item value type not allowed in:' + A + ' item' : '此条颜色规则的value类型不合理，在：' + A + '项'; }
        case 45200: { return english ? 'ColorRule item value length cannot > 100 in:' + A + ' item' : '此条颜色规则的value字符长度不能大于100，在：' + A + '项'; }

        case 50000: { return english ? 'Template missing widthRule attribute' : '模板缺失widthRule属性'; } //widthRule property check
        case 50100: { return english ? 'Template widthRule is not an object' : '模板widthRule不是一个对象'; }
        case 50200: { return english ? 'WidthRule missing basis attribute' : '宽度规则缺失basis属性'; }
        case 50300: { return english ? 'WidthRule basis value type error' : '宽度规则basis值类型错误'; }
        case 50400: { return english ? 'WidthRule missing type attribute' : '宽度规则缺失type属性'; }
        case 50500: { return english ? 'WidthRule type value type error' : '宽度规则type值类型错误'; }
        case 50600: { return english ? 'WidthRule missing condition attribute' : '宽度规则缺失condition属性'; }
        case 50700: { return english ? 'WidthRule condition is not an array' : '宽度规则condition不是一个数组'; }
        case 50800: { return english ? 'If the basis is empty, the type must be empty' : '宽度规则中，如果basis为空，则type必须为空'; }
        case 50900: { return english ? 'If the basis is empty, the condition must be an empty array' : '宽度规则中，如果basis为空，则condition必须是一个空数组'; }
        case 51000: { return english ? 'If the basis is not empty, the type cannot be empty' : '宽度规则中，如果basis不为空，则type不能为空'; }
        case 51100: { return english ? 'WidthRule type value not allowed' : '宽度规则type值不合理'; }
        case 51200: { return english ? 'WidthRule item length cannot > 90' : '宽度规则数量不能大于90'; }

        case 52000: { return english ? 'WidthRule item is not an object in:' + A + ' item' : '此条宽度规则不是一个对象，在：' + A + '项'; }
        case 52100: { return english ? 'WidthRule item missing set attribute in:' + A + ' item' : '此条宽度规则缺失set属性，在：' + A + '项'; }
        case 52200: { return english ? 'WidthRule item set value type error in:'+A+' item' : '此条宽度规则set值类型错误，在：' + A + '项';}

        case 53000: { return english ? 'WidthRule item missing width attribute in:' + A + ' item' : '此条宽度规则缺失width属性，在：' + A + '项'; }
        case 53100: { return english ? 'WidthRule item width value type error in:' + A + ' item' : '此条宽度规则width值类型错误，在：' + A + '项'; }
        case 53200: { return english ? 'WidthRule item width value must be integer in:' + A + ' item' : '此条宽度规则width值必须为整数，在：' + A + '项'; }

        case 54000: { return english ? 'WidthRule item missing method attribute in:' + A + ' item' : '此条宽度规则缺失method属性，在：' + A + '项'; }
        case 54100: { return english ? 'WidthRule item method value type error in:' + A + ' item' : '此条宽度规则的method值类型错误，在：' + A + '项'; }
        case 54200: { return english ? 'WidthRule item method not allowed in:' + A + ' item' : '此条宽度规则的method不合理，在：' + A + '项'; }

        case 55000: { return english ? 'WidthRule item missing value attribute in:' + A + ' item' : '此条宽度规则缺失value属性，在：' + A + '项'; }
        case 55100: { return english ? 'WidthRule item value type not allowed in:' + A + ' item' : '此条宽度规则的value类型不合理，在：' + A + '项'; }
        case 55200: { return english ? 'WidthRule item value length cannot > 100 in:' + A + ' item' : '此条宽度规则的value字符长度不能大于100，在：' + A + '项'; }
      }
    },
    tpCheck(template){//模板检查,若正常则返回true，否则返回其他错误的代码
      if(template===null)return 500;
      let arr=[];
      let names=['name'];
      let len=0;
      let count=0;
      let cType='';
      let wType='';
      function isObj(value){return typeof value==='object' && !Array.isArray(value) && value!==null;}


      if(!isObj(template))return 1000;


      if(!Object.prototype.hasOwnProperty.call(template,'id'))return 2000;//A layer property check
      if(typeof template.id!=='string')return 2100;
      if(template.id==='')return 2200;

      if(!Object.prototype.hasOwnProperty.call(template,'name'))return 4000;
      if(typeof template.name!=='string')return 4100;
      if(template.name==='')return 4200;

      if(!Object.prototype.hasOwnProperty.call(template,'creator'))return 6000;
      if(typeof template.creator!=='string')return 6100;
      if(template.creator==='')return 6200;

      if(!Object.prototype.hasOwnProperty.call(template,'modify'))return 8000;
      if(typeof template.modify!=='string')return 8100;
      if(template.modify==='')return 8200;

      if(!Object.prototype.hasOwnProperty.call(template,'locked'))return 10000;
      if(typeof template.locked!=='boolean')return 10100;

      if(!Object.prototype.hasOwnProperty.call(template,'explain'))return 12000;
      if(typeof template.explain!=='string')return 12100;


      if(!Object.prototype.hasOwnProperty.call(template,'typeRule'))return 14000;//typeRule property check
      if(!isObj(template.typeRule))return 15000;
      if(!Object.prototype.hasOwnProperty.call(template.typeRule,'point'))return 16000;
      if(typeof template.typeRule.point!=='boolean')return 17000;
      if(template.typeRule.point)count++;
      if(!Object.prototype.hasOwnProperty.call(template.typeRule,'line'))return 18000;
      if(typeof template.typeRule.line!=='boolean')return 19000;
      if(template.typeRule.line)count++;
      if(!Object.prototype.hasOwnProperty.call(template.typeRule,'area'))return 20000;
      if(typeof template.typeRule.area!=='boolean')return 21000;
      if(template.typeRule.area)count++;
      if(!Object.prototype.hasOwnProperty.call(template.typeRule,'curve'))return 22000;
      if(typeof template.typeRule.curve!=='boolean')return 23000;
      if(template.typeRule.curve)count++;
      if(count<=0){return 24000;}


      if(!Object.prototype.hasOwnProperty.call(template,'detailsRule'))return 30000;//detailsRule property check
      if(!Array.isArray(template.detailsRule))return 30100;
      len=template.detailsRule.length;
      arr=template.detailsRule;
      if(len<=0)return 30200;
      if(len>90)return 30300;
      if(!isObj(arr[0]))return 30400;
      if(!this.isNameDetails(arr[0]))return 30500;
      for(let i=1;i<len;i++){
        if(!isObj(arr[i])){
          return 31000+i;
        }else {
          if(!Object.prototype.hasOwnProperty.call(arr[i],'set'))return 32000+i;
          if(typeof arr[i].set!=='boolean')return 32100+i;

          if(!Object.prototype.hasOwnProperty.call(arr[i],'name'))return 33000+i;
          if(typeof arr[i].name!=='string')return 33100+i;
          if(arr[i].name==='')return 33200+i;
          if(arr[i].name.length>40)return 33300+i;
          if(names.includes(arr[i].name)){return 33400+i}//检测重复属性
          else{names.push(arr[i].name);}

          if(!Object.prototype.hasOwnProperty.call(arr[i],'empty'))return 34000+i;
          if(typeof arr[i].empty!=='boolean')return 34100+i;

          if(!Object.prototype.hasOwnProperty.call(arr[i],'type'))return 35000+i;
          if(typeof arr[i].type!=='string')return 35100+i;
          if(!this.isDetailsType(arr[i].type))return 35200+i;

          if(!Object.prototype.hasOwnProperty.call(arr[i],'length'))return 36000+i;
          if(typeof arr[i].length!=='number')return 36100+i;
          if(!this.isAllowTypeLen(arr[i].type,arr[i].length))return 36200+i;

          if(!Object.prototype.hasOwnProperty.call(arr[i],'default'))return 37000+i;
          if(!this.isAllowValueTypL(arr[i].type,arr[i].length,arr[i].default))return 37100+i;
        }
      }


      if(!Object.prototype.hasOwnProperty.call(template,'colorRule'))return 40000;//colorRule property check
      if(!isObj(template.colorRule))return 40100;
      if(!Object.prototype.hasOwnProperty.call(template.colorRule,'basis'))return 40200;
      if(typeof template.colorRule.basis!=='string')return  40300;
      if(!Object.prototype.hasOwnProperty.call(template.colorRule,'type'))return 40400;
      if(typeof template.colorRule.type!=='string')return  40500;
      if(!Object.prototype.hasOwnProperty.call(template.colorRule,'condition'))return 40600;
      if(!Array.isArray(template.colorRule.condition))return  40700;
      if(template.colorRule.basis===''){//rule(A)
        if(template.colorRule.type!=='')return 40800;
        if(template.colorRule.condition.length!==0)return 40900;
      }else{
        if(template.colorRule.type==='')return 41000;
        if(!this.isDetailsType(template.colorRule.type))return 41100;
      }
      len=template.colorRule.condition.length;
      if(len>90)return 41200;//规则条例最多90条
      arr=template.colorRule.condition;
      cType=template.colorRule.type;
      for(let i=0;i<len;i++){
        if(!isObj(arr[i])){
          return 42000+i;
        }else {
          if(!Object.prototype.hasOwnProperty.call(arr[i],'set'))return 42100+i;
          if(typeof arr[i].set!=='boolean')return 42200+i;

          if(!Object.prototype.hasOwnProperty.call(arr[i],'color'))return 43000+i;
          if(typeof arr[i].color!=='string')return 43100+i;
          if(!this.isColor16(arr[i].color))return 43200+i;

          if(!Object.prototype.hasOwnProperty.call(arr[i],'method'))return 44000+i;
          if(typeof arr[i].method!=='string')return 44100+i;
          if(!this.isAllowMethod(cType,arr[i].method))return 44200+i;

          if(!Object.prototype.hasOwnProperty.call(arr[i],'value'))return 45000+i;
          if(!this.isAllowValueTyp(cType,arr[i].value))return 45100+i;
          if(typeof arr[i].value==='string'){//rule(E)
            if(arr[i].value.length>100)return 45200+i;
          }
        }
      }


      if(!Object.prototype.hasOwnProperty.call(template,'widthRule'))return 50000;//widthRule property check
      if(!isObj(template.widthRule))return 50100;
      if(!Object.prototype.hasOwnProperty.call(template.widthRule,'basis'))return 50200;
      if(typeof template.widthRule.basis!=='string')return  50300;
      if(!Object.prototype.hasOwnProperty.call(template.widthRule,'type'))return 50400;
      if(typeof template.widthRule.type!=='string')return  50500;
      if(!Object.prototype.hasOwnProperty.call(template.widthRule,'condition'))return 50600;
      if(!Array.isArray(template.widthRule.condition))return  50700;
      if(template.widthRule.basis===''){//rule(A)
        if(template.widthRule.type!=='')return 50800;
        if(template.widthRule.condition.length!==0)return 50900;
      }else{
        if(template.widthRule.type==='')return 51000;
        if(!this.isDetailsType(template.widthRule.type))return 51100;
      }
      len=template.widthRule.condition.length;
      if(len>90)return 51200;//规则条例最多90条
      arr=template.widthRule.condition;
      wType=template.widthRule.type;
      for(let i=0;i<len;i++){
        if(!isObj(arr[i])){
          return 52000+i;
        }else {
          if(!Object.prototype.hasOwnProperty.call(arr[i],'set'))return 52100+i;
          if(typeof arr[i].set!=='boolean')return 52200+i;

          if(!Object.prototype.hasOwnProperty.call(arr[i],'width'))return 53000+i;
          if(typeof arr[i].width!=='number')return 53100+i;
          if(!this.isInteger(arr[i].width))return 53200+i;

          if(!Object.prototype.hasOwnProperty.call(arr[i],'method'))return 54000+i;
          if(typeof arr[i].method!=='string')return 54100+i;
          if(!this.isAllowMethod(wType,arr[i].method))return 54200+i;

          if(!Object.prototype.hasOwnProperty.call(arr[i],'value'))return 55000+i;
          if(!this.isAllowValueTyp(wType,arr[i].value))return 55100+i;
          if(typeof arr[i].value==='string'){//rule(E)
            if(arr[i].value.length>100)return 55200+i;
          }
        }
      }
      return true;
    },
    /**
     * tpCheck
     */
  },
  computed:{
    templateStatus(){
      if(this.editTemplate===null)return '空的';
      if(this.tpCheck(this.editTemplate)===true)return '正常(点击检查)';
      return '异常(点击修复)';
    },
    userName(){
      if(this.$store.state.serverData.socket!==undefined){
        if(this.$store.state.serverData.socket.userData!==null){
          return this.$store.state.serverData.socket.userData.user_name;
        }else {
          return this.$store.state.serverData.userName
        }
      }else {
        return this.$store.state.serverData.userName;
      }
    },
    userEmail(){
      if(this.$store.state.serverData.socket!==undefined){
        if(this.$store.state.serverData.socket.userData!==null){
          return this.$store.state.serverData.socket.userData.user_email;
        }else {
          return this.$store.state.serverData.userEmail
        }
      }else {
        return this.$store.state.serverData.userEmail;
      }
    },
    overviewType(){
      let str=[];
      let obj={
        point:true,
        line:true,
        area:true,
        curve:true
      };//用函数检查上述的对象是否正确，四种类型中必须要有一种类型为true才算正确
      if(this.editTemplate.typeRule.area===true){
        str.push('Area');
      }
      if(this.editTemplate.typeRule.line===true){
        str.push('Line');
      }
      if(this.editTemplate.typeRule.point===true){
        str.push('point');
      }
      if(this.editTemplate.typeRule.curve===true){
        str.push('curve');
      }
      return str.join('、');
    },
    overviewDetails(){
      let str=[];
      let len=this.editTemplate.detailsRule.length;
      for(let i=0;i<len;i++){
        if(this.editTemplate.detailsRule[i].name!=''){
          str.push(this.editTemplate.detailsRule[i].name);
        }
      }
      return str.join('、');
    },
    overviewWidth(){
      let basis=this.editTemplate.widthRule.basis;
      if(basis===null || basis===''){
        return '无';
      }
      let str=[];
      let len=this.editTemplate.widthRule.condition.length;
      for(let i=0;i<len;i++){
        let sym=this.editTemplate.widthRule.condition[i].method;
        let val=this.editTemplate.widthRule.condition[i].value;
        let width=this.editTemplate.widthRule.condition[i].width;
        switch (sym){
          case 'equ':{
            str.push({
              str:basis+' = '+val,width
            });
            break;
          }
          case 'nequ':{
            str.push({
              str:basis+' ≠ '+val,width
            });
            break;
          }
          case 'gre':{
            str.push({
              str:basis+' > '+val,width
            });
            break;
          }
          case 'greq':{
            str.push({
              str:basis+' ≥ '+val,width
            });
            break;
          }
          case 'les':{
            str.push({
              str:basis+' < '+val,width
            });
            break;
          }
          case 'lesq':{
            str.push({
              str:basis+' ≤ '+val,width
            });
            break;
          }
          case 'mod0':{
            str.push({
              str:basis+' mod '+val+' = 0',width
            });
            break;
          }
          case 'nmod0':{
            str.push({
              str:basis+' mod '+val+' ≠ 0',width
            });
            break;
          }
        }
      }
      return str;
    },
    overviewColor(){//规则一览中的颜色规则
      let basis=this.editTemplate.colorRule.basis;
      if(basis===null || basis===''){
        return '无';
      }
      let str=[];
      let len=this.editTemplate.colorRule.condition.length;
      for(let i=0;i<len;i++){
        let sym=this.editTemplate.colorRule.condition[i].method;
        let val=this.editTemplate.colorRule.condition[i].value;
        let color=this.editTemplate.colorRule.condition[i].color;
        switch (sym){
          case 'equ':{
            str.push({
              str:basis+' = '+val,color
            });
            break;
          }
          case 'nequ':{
            str.push({
              str:basis+' ≠ '+val,color
            });
            break;
          }
          case 'gre':{
            str.push({
              str:basis+' > '+val,color
            });
            break;
          }
          case 'greq':{
            str.push({
              str:basis+' ≥ '+val,color
            });
            break;
          }
          case 'les':{
            str.push({
              str:basis+' < '+val,color
            });
            break;
          }
          case 'lesq':{
            str.push({
              str:basis+' ≤ '+val,color
            });
            break;
          }
          case 'mod0':{
            str.push({
              str:basis+' mod '+val+' = 0',color
            });
            break;
          }
          case 'nmod0':{
            str.push({
              str:basis+' mod '+val+' ≠ 0',color
            });
            break;
          }
        }
      }
      return str;
    },
    allowType2Width(){//传入type类型获取可用的method及其字面意思
      switch (this.editTemplate.widthRule.type) {
        case 'text':{
          return {'equ':'等于','nequ':'不等于'};
        }
        case 'bool':{
          return {'equ':'等于','nequ':'不等于'};
        }
        case 'list':{
          return {'equ':'等于','nequ':'不等于'};
        }
        case 'date':{
          return {'equ':'等于','nequ':'不等于','gre':'大于','greq':'大于等于','les':'小于','lesq':'小于等于'};
        }
        case 'percent':{
          return {'equ':'等于','nequ':'不等于','gre':'大于','greq':'大于等于','les':'小于','lesq':'小于等于'};
        }
        case 'number':{
          return {'equ':'等于','nequ':'不等于','gre':'大于','greq':'大于等于','les':'小于','lesq':'小于等于','mod0':'模等于0','nmod0':'模不等于0'};
        }
        case 'score':{
          return {'equ':'等于','nequ':'不等于','gre':'大于','greq':'大于等于','les':'小于','lesq':'小于等于','mod0':'模等于0','nmod0':'模不等于0'};
        }
        default:{
          return  [];
        }
      }
    },
    allowType2Color(){
      switch (this.editTemplate.colorRule.type) {
        case 'text':{
          return {'equ':'等于','nequ':'不等于'};
        }
        case 'bool':{
          return {'equ':'等于','nequ':'不等于'};
        }
        case 'list':{
          return {'equ':'等于','nequ':'不等于'};
        }
        case 'date':{
          return {'equ':'等于','nequ':'不等于','gre':'大于','greq':'大于等于','les':'小于','lesq':'小于等于'};
        }
        case 'percent':{
          return {'equ':'等于','nequ':'不等于','gre':'大于','greq':'大于等于','les':'小于','lesq':'小于等于'};
        }
        case 'number':{
          return {'equ':'等于','nequ':'不等于','gre':'大于','greq':'大于等于','les':'小于','lesq':'小于等于','mod0':'模等于0','nmod0':'模不等于0'};
        }
        case 'score':{
          return {'equ':'等于','nequ':'不等于','gre':'大于','greq':'大于等于','les':'小于','lesq':'小于等于','mod0':'模等于0','nmod0':'模不等于0'};
        }
        default:{
          return  [];
        }
      }
    },
    /**
     * @return {boolean}
     */
    TemplateShow(){
      return this.$store.state.templateConfig.templateShow;
    },
    /**
     * @return {number}
     */
    TaskCode(){
      return this.$store.state.templateConfig.taskCode;
    },
    /**
     * @return {object|null}
     */
    EditTemplate(){
      return this.$store.state.templateConfig.editTemplate;
    },
    /**
     * @return {object|null}
     */
    EditBackup(){
      return this.$store.state.templateConfig.editBackup;
    },
    /**
     * @return {object|null}
     */
    EditName(){
      return this.$store.state.templateConfig.editName;
    },
  },
  watch:{
    TaskCode(){
      if(this.TemplateShow){
        let ID=this.createTemplateId();
        let Empty={
          id:ID,
          name:'',
          creator:'',
          modify:'',
          locked:false,
          explain:'none',
          typeRule:{point:true, line:true, area:true, curve:true},
          detailsRule:[{set:false, name:'name', default:'unknown', type:'text', length:100, empty:true}],
          colorRule:{basis:'', type:'', condition:[]},
          widthRule:{basis:'', type:'', condition:[]}
        };
        this.templateShow=true;
        if(this.EditTemplate!==null){//传入模板不为空
          if(this.tpCheck(this.EditTemplate)){//传入模板通过检查
            this.editTemplate=this.EditTemplate;
            this.taskCode=this.TaskCode;
          }else {
            this.editTemplate=Empty;
            this.taskCode=this.TaskCode;
          }
        }else {
          this.editTemplate=Empty;
          this.taskCode=this.TaskCode;
        }
      }else {
        this.closeAndCancel();
      }
    }
  }
}
</script>

<style scoped>
button{
  cursor: pointer;
  -webkit-appearance: none;
  width: auto;
  min-width: 100px;
  border-radius: 24px;
  text-align: center;
  padding: 15px 40px;
  background-color: #7dc5ff;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  -webkit-box-shadow: 0 2px 6px -1px rgba(0,0,0,.13);
  box-shadow: 0 2px 6px -1px rgba(0,0,0,.13);
  border: none;
  -webkit-transition: all .3s ease;
  transition: all .3s ease;
  outline: 0;
}
button:hover{
  background: #289ffe;
}
button:active{
  background: #ffffff;
  color: #000000;
}
.BananaTemplateEdit{
  width: 100%;
  height: 100%;
}
.templateMenuClose{
  width: 100%;
  height: 100%;
  position: fixed;
  background: rgba(0,0,0,0.2);
  z-index: 555;
  top: 0px;
  left: 0px;
}
.templateMenu{
  width: calc(50% - 30px);
  min-width: 690px;
  height: 60%;
  min-height: 410px;
  background: #ffffff;
  position: fixed;
  z-index: 558;
  top: -5%;
  left: 25%;
  padding: 0px 15px;
  border-radius: 5px;
}
.RowTitle{
  font-size: 17px;
  color: #466fe7;
  user-select: none;
  cursor: default;
}
.RowText{
  font-size: 14px;
  color: #000000;
}
.RowText:nth-child(odd){
  background: #ffffff;
}
.RowText:nth-child(even){
  background: #f5f5f5;
}
.RowEmpty{
  width: 100%;
  height: 100%;
  border-radius: 5px;
  font-size: 17px;
  font-weight: 800;
  background: #757575;
  color: white;
  cursor: cell;
  user-select: none;
  text-align: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.RowButton{
  width: 100%;
  height: 100%;
  border-radius: 5px;
  font-size: 17px;
  font-weight: 800;
  background: #7dc5ff;
  color: white;
  cursor: cell;
  user-select: none;
  text-align: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  transition: all .3s ease;
}
.RowButton:hover{
  background: #289ffe;
}
.RowButton:active{
  background: #ffffff;
  color: #000000;
}
.statusInput{
  width: 92%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  font-size: 16px;
  padding: 0px 0px 2px 0px;
  height:auto;
  border: none;
  -webkit-transition: all .3s linear;
  transition: all .3s linear;
  color: #000;
  font-weight: 400;
  -webkit-appearance: none;
  outline: none;
  text-align: center;
}
input[disabled]{
  background-image: url('svgValidIcons/InputLockBackground.svg');
  background-repeat: no-repeat;
  background-position: center center;
}
.SheetInput{
  width: 92%;
  margin-top:1px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  font-size: 14px;
  padding: 5px 0px;
  height: 28px;
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-transition: all .3s linear;
  transition: all .3s linear;
  color: #000;
  font-weight: 400;
  -webkit-appearance: none;
  outline: none;
}
.SheetInput[type='number']{
  text-align: center;
}
.SheetInput:focus{
  border-bottom: 1px solid rgba(0, 0, 0, 0.55);
}
.SheetCo0 span{
  width: 100%;
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 13px;
  font-weight: 100;
}
.SheetCo0{
  width: 5%;
  height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.SheetCo1{
  width: 25%;
  height: 40px;
  display: flex;
  justify-content: start;
  align-items: center;
}
.SheetCo2{
  width:33%;
  height: 40px;
  display: flex;
  justify-content: start;
  align-items: center;
}
.pickCo3{/*used*/
  background: #e6e6e6;
}
.itemCo3{
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: default;
}
.lopCo3{
  width:100%;
  height:auto;
  padding:5px 0px;
  user-select: none;
}
.listCo3{
  width: 100%;
  height: auto;
  background: #ffffff;
  box-shadow: 0px 0px 6px #c2c2c2;
  border-radius: 4px;
  position: relative;
  right: 0px;
  top: 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.iconCo3{
  width: 16px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.inputCo3{
  user-select: none;
  width: calc(100% - 16px);
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.SheetCo3{
  width: 17%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.SheetCo4{
  width: 10%;
  margin-left: 2%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.SheetCo5{
  width: 8%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.SheetCo7{
  width: 14%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.SheetCo8{
  width: 25%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.SheetCo9{
  width: 56%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.inpCo9{
  width: 55px;
  min-width: 15px;
  height: 30px;
  margin: 0px 5px ;
}
.colCo9{
  width: calc(100% - 55px - 10px);
  height: 21px;
  overflow: hidden;
  padding: 0px 0px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: start;
  align-items: center;
  position: relative;
  background: white;
  box-shadow: 0px 0px 2px #717171;
}
.widCo9{
  width: calc(100% - 55px - 10px);
  height: 100%;
  overflow: hidden;
  padding: 0px 0px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: start;
  align-items: center;
  position: relative;
  background: white;
  box-shadow: 0px 0px 2px #717171;
}
.widCo9 span{
  width: 20%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: default;
}
.colCo9:hover{
  height: auto !important;
  width: 100% !important;
}
.lisCo9{
  width: 15px;
  height: 15px;
  margin:3px;
}
.SheetRow{
  width: 100%;
  height: 40px;
  margin: 4px 0px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: center;
}
.detailsSheet{
  width: 100%;
  height: auto;
}
.setExplain{
  width: 100%;
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 100;
  display: flex;
  cursor: default;
  flex-direction: row;
  justify-content: start;
  align-items: center;
}
.setChoice{
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  flex-wrap: wrap;
}
.cursorDefault{
  cursor: default;
}
.setSelect{
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: start;
  flex-wrap: wrap;
}
.setSelectBox{
  width: auto;
  height: auto;
  padding: 5px;
  transition: 0.4s;
}
.setChoiceBox{
  width: auto;
  height: auto;
  padding: 5px;
  margin: 10px;
  transition: 0.4s;
}
.unUseTemplate{
  cursor: pointer;
  user-select: none;
  border-radius: 4px;
  border:4px solid #ffffff;
}
.useTemplate{
  cursor: pointer;
  user-select: none;
  border-radius: 4px;
  border:4px solid #818181;
}
.setSelectBox span{
  width: auto;
  min-width: 80px;
  max-width: 200px;
  height: 30px;
  padding: 5px;
  margin: 5px;
  font-size: 16px;
  font-weight: 400;
  border-radius: 2px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  overflow: hidden;
}
.setChoiceBox span{
  width: auto;
  min-width: 90px;
  max-width: 200px;
  height: 30px;
  padding: 5px;
  margin: 5px;
  font-size: 18px;
  color: #4b4b4b;
  font-weight: 800;
  border-radius: 2px;
}
.setTitle{
  width: 100%;
  height: 40px;
  font-size: 16px;
  font-weight: 400;
  cursor: default;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
}
.setList{
  width: 100%;
  height: auto;
  padding: 10px 0px 10px 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.TContent{
  width: calc(100% - 2px);
  padding-right: 2px;
  box-sizing: border-box;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  overflow-y: scroll;
  overflow-x: hidden;
}
.statusList{
  width: 100%;
  height: auto;
  padding: 10px 0px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  border-bottom: 1px solid #838383;
}
.ListLeft{
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  width: 180px;
  height: 100%;
}
.ListRight{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: calc(100% - 180px);
  height: auto;
  overflow-x: hidden;
  overflow-y: auto;
}
.ListRightText{
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
}
.ListRightColor{
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: start;
  align-items: start;
}
.templateNifty{
  width: 100%;
  height: 100%;
}
.overviewColor{
  width: 13px;
  height: 13px;
  margin-left: 1px;
  border-radius: 13px;
}
.overviewRule{
  width: auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  margin-right: 25px;
}
.overviewStart{
  width: auto;
}
.overviewText{
  margin-right: 5px;
}
.HContent{
  width: calc(100% - 90px);
  height: 100%;
  overflow: auto;
  float: left;
  color:#393939;
}
.Navigation{
  width: 100px;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  right: 20px;
}
.NavigationTi{
  font-size: 15px;
  font-weight: 400;
  color: #2d2d2d;
  margin: 5px 0px;
  cursor: default;
}
.NavigationLi{
  font-size: 15px;
  font-weight: 400;
  color: #58a8fe;
  margin: 5px 0px;
  cursor: pointer;
}
.NavigationLi:hover{
  text-decoration:underline;
}
.textH1{
  font-weight: 400;
  font-size: 18px;
  text-align: center;
  margin: 10px;
}
.textH2{
  font-weight: 400;
  font-size: 15px;
  text-align: start;
  margin: 10px;
  text-indent: 32px;
}
.textH3{
  font-weight: 400;
  font-size: 17px;
  text-align: start;
  margin: 10px;
}
.textH4{
  color: #ff4f4f;
}
.templateTitle{
  width: 100%;
  height: 55px;
  font-size: 20px;
  font-weight: 800;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  cursor: default;
}
.templateContent{
  width: 100%;
  height: calc(100% - 55px - 55px);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.templateLeft{
  width: 180px;
  height: calc(100% - 5px);
  padding-top: 5px;
  background: #f8f8f8;
  box-shadow: 0px 0px 10px #d8d8d8;
  user-select: none;
}
.templateRight{
  width: calc(100% - 180px - 40px);
  height: calc(100% - 40px);
  padding: 20px;
}
.templateBottom{
  width: 100%;
  height: 55px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}
.templateBottom button{
  width: auto;
  height: auto;
  font-weight: 400;
  font-size: 15px;
  padding: 3px 8px;
}
.templateSel{
  width: calc(100% - 20px);
  margin: 0px 10px;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  height: 50px;
  font-size: 16px;
  font-weight: 400;
}
.templateSel span{
  width: calc(100% - 5px);
  height: 30px;
  border-width: 1px;
  border-style: solid ;
  padding-left: 5px;
  border-radius: 2px;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  cursor: pointer;
  transition: 0.4s !important;
}
.templateSel span:hover{
  background: #f6fdff !important;;
  border-color: #9ee9ff !important;;
  color: #00bcd4 !important;;
}
.nifty{
  animation: niftyEd 0.4s forwards;
}
.unNifty{
  background: #ffffff;
  border-color: #c7c7c7;
  color: #717171;
}
@keyframes niftyEd {
  from{
    background: #ffffff;
    border-color: #c7c7c7;
    color: #717171;
  }
  to{
    transform: scale(1.2);
    background: #f6fdff;
    border-color: #9ee9ff;
    color: #00bcd4;
  }
}
</style>
