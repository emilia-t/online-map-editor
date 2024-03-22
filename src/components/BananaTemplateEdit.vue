<template>
  <div class="BananaTemplateEdit">
    <div class="templateMenu" @click.stop="void 0" v-if="templateShow">
      <div class="templateTitle">
        <span>模板设置：{{structure[0]}}</span>
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
                模板，是分组图层内置的一个用于规范分组内元素成员的基本规则或条例。使用模板可以限制分组内可添加的元素类型，规定成员的属性名称，或者依据成员的某项属性来自动设置其颜色、宽度等参数。为便于理解，我们会在之后的文档中，逐一介绍并示范模板的各项功能：包括模板状态更改、设置基本类型、设置属性规则、设置颜色规则、设置宽度规则。<span class="textH4">我们会在需要重点关注的地方使用蓝色字体以显著。</span>
              </div>
              <div class="textH3">
                模板状态更改：
              </div>
              <div class="textH2">
                模板，是分组图层内置的一个用于规范分组内元素成员的基本规则或条例。使用模板可以限制分组内可添加的元素类型，规定成员的属性名称，或者依据成员的某项属性来自动设置其颜色、宽度等参数。为便于理解，我们会在之后的文档中，逐一介绍并示范模板的各项功能：包括模板状态更改、设置基本类型、设置属性规则、设置颜色规则、设置宽度规则。<span class="textH4">我们会在需要重点关注的地方使用蓝色字体以显著。</span>
              </div>
              <div class="textH3">
                设置基本类型：
              </div>
              <div class="textH2">
                模板，是分组图层内置的一个用于规范分组内元素成员的基本规则或条例。使用模板可以限制分组内可添加的元素类型，规定成员的属性名称，或者依据成员的某项属性来自动设置其颜色、宽度等参数。为便于理解，我们会在之后的文档中，逐一介绍并示范模板的各项功能：包括模板状态更改、设置基本类型、设置属性规则、设置颜色规则、设置宽度规则。<span class="textH4">我们会在需要重点关注的地方使用蓝色字体以显著。</span>
              </div>
            </div>
            <div class="Navigation">
              <div class="NavigationTi">文档导航栏</div>
              <div class="NavigationLi">模板简介</div>
              <div class="NavigationLi">模板状态更改</div>
              <div class="NavigationLi">设置基本类型</div>
              <div class="NavigationLi">设置基本类型</div>
            </div>
          </div>
          <div class="templateNifty" v-if="templateNifty===2">
            <div class="TContent" >
              <div class="statusList cursorDefault">
                <span class="ListLeft">模板状态</span>
                <span class="ListRight">空的模板</span>
              </div>
              <div class="statusList cursorDefault">
                <span class="ListLeft">锁定状态</span>
                <span class="ListRight" style="cursor:pointer" @click="templateSettings.locked=true" v-show="!templateSettings.locked">未锁定(点击锁定)</span>
                <span class="ListRight" style="cursor:pointer" @click="templateSettings.locked=false" v-show="templateSettings.locked">已锁定(点击解锁)</span>
              </div>
              <div class="statusList">
                <span class="ListLeft cursorDefault">模板名称</span>
                <span class="ListRight">
                  <input class="statusInput" type="text" placeholder="未命名模板" v-model="templateSettings.name" :disabled="templateSettings.locked" @focus="onFocusMode()" @blur="noFocusMode()"/>
                </span>
              </div>
              <div class="statusList">
                <span class="ListLeft cursorDefault">描述信息</span>
                <span class="ListRight" style="align-items: start">
                  <input class="statusInput" type="text" placeholder="空的描述信息" v-model="templateSettings.explain" :disabled="templateSettings.locked" @focus="onFocusMode()" @blur="noFocusMode()"/>
                </span>
              </div>
              <div class="statusList cursorDefault">
                <span class="ListLeft">创建者</span>
                <span class="ListRight">{{templateSettings.creator}}</span>
              </div>
              <div class="statusList cursorDefault">
                <span class="ListLeft">修改日期</span>
                <span class="ListRight">{{templateSettings.modify}}</span>
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
                        <div class="overviewText">{{item.str}} color ⇒ </div>
                        <div class="overviewColor" :style="{background:item.color}"></div>
                      </div>
                  </div>
                  <div class="ListRightColor">
                    <div class="overviewStart">
                      宽度规则：
                    </div>
                    <div class="overviewRule" v-for="item in overviewWidth">
                      <div class="overviewText">{{item.str}}</div>
                      <div class="overviewText">width ⇒ {{item.width}}</div>
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
                  设置模板类型
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
                  <div class="setChoiceBox" :class="status?'useTemplate':'unUseTemplate'" :key="type" v-for="(status,type) in templateSettings.typeRule">
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
                  <div class="SheetRow RowText" v-for="(item,index) in this.templateSettings.detailsRule">
                    <div class="SheetCo0">
                      <span @click.stop="detailsUp(index)" v-show="!switchDelMod1"><arrow-up></arrow-up></span>
                      <span @click.stop="detailsDown(index)" v-show="!switchDelMod1"><arrow-down></arrow-down></span>
                      <span @click.stop="deleteDetails(index)" v-show="switchDelMod1"><trash-can></trash-can></span>
                    </div>
                    <div class="SheetCo1">
                      <input class="SheetInput" type="text" v-model="item.name" :disabled="templateSettings.locked || item.name==='name'" @focus="onFocusMode()" @blur="noFocusMode()"/>
                    </div>
                    <div class="SheetCo2">
                      <input class="SheetInput" type="text" v-model="item.default" :disabled="templateSettings.locked || item.name==='name'" @focus="onFocusMode()" @blur="noFocusMode()"/>
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
                      <div class="iconCo3" @click="item.set=true" v-show="!item.set && templateSettings.locked===false">
                        <dropdown-button></dropdown-button>
                      </div>
                      <div class="iconCo3" @click="alertTip('请先解锁模板')" v-show="templateSettings.locked===true">
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
                      <div class="iconCo3" @click="item.set=true" v-show="!item.set && templateSettings.locked===false">
                        <dropdown-button></dropdown-button>
                      </div>
                      <div class="iconCo3" @click="alertTip('请先解锁模板')" v-show="templateSettings.locked===true">
                        <dropdown-button></dropdown-button>
                      </div>
                    </div>
                    <div class="SheetCo4">
                      <input class="SheetInput" type="number" v-model="item.length" :disabled="templateSettings.locked || item.name==='name'" @focus="onFocusMode()" @blur="noFocusMode()"/>
                    </div>
                    <div class="SheetCo5">
                      <input type="checkbox" :checked="item.empty" v-model="item.empty" :disabled="templateSettings.locked || item.name==='name'" @focus="onFocusMode()" @blur="noFocusMode()"/>
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
                  <select name="colorsAoe" v-model="templateSettings.colorRule.basis" :disabled="templateSettings.locked" :title="'当前依据属性类型：'+templateSettings.colorRule.type" @change="changeColorRuleBasis()">
                    <option :value="item.name" v-if="item.type!=='long' && item.name!==''" v-for="item in templateSettings.detailsRule">{{item.name}}</option>
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
                  <div class="SheetRow RowText" v-for="(item,index) in templateSettings.colorRule.condition">
                    <div class="SheetCo0">
                      <span @click.stop="colorUp(index)" v-show="!switchDelMod2"><arrow-up></arrow-up></span>
                      <span @click.stop="colorDown(index)" v-show="!switchDelMod2"><arrow-down></arrow-down></span>
                      <span @click.stop="deleteColor(index)" v-show="switchDelMod2"><trash-can></trash-can></span>
                    </div>
                    <div class="SheetCo7">
                      <div class="lopCo3" v-show="item.set">
                        <div class="listCo3">
                          <div class="itemCo3" v-for="(nn,oo) in allowType2Color" :class="item.type===oo?'pickCo3':''" @click.stop="()=>{item.type=oo;item.set=false}">{{nn}}</div>
                          <div class="itemCo3" style="color:#1ba903" @click.stop="()=>{item.set=false}">返回</div>
                        </div>
                      </div>
                      <div class="inputCo3" v-show="!item.set">
                        {{item.type}}
                      </div>
                      <div class="iconCo3" @click="item.set=true" v-show="!item.set && templateSettings.locked===false">
                        <dropdown-button></dropdown-button>
                      </div>
                      <div class="iconCo3" @click="alertTip('请先解锁模板')" v-show="templateSettings.locked===true">
                        <dropdown-button></dropdown-button>
                      </div>
                    </div>
                    <div class="SheetCo8">
                      <input class="SheetInput" type="text" v-model="item.value" :disabled="templateSettings.locked" @focus="onFocusMode()" @blur="noFocusMode()"/>
                    </div>
                    <div class="SheetCo9">
                      <input class="inpCo9" type="color" v-model="item.color" :disabled="templateSettings.locked"/>
                      <div class="colCo9">
                        <div class="lisCo9" v-for="color in colors" :style="'background:'+color" @click="()=>{if(!templateSettings.locked)item.color=color}"></div>
                      </div>
                    </div>
                  </div>
                  <div class="SheetRow" v-show="templateSettings.colorRule.condition.length===0">
                    <div class="RowEmpty" @click="addColorRule()" >Empty rule Click to add ✚</div>
                  </div>
                  <div class="SheetRow" v-show="templateSettings.colorRule.condition.length!==0">
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
                  <select name="colorsAoe" v-model="templateSettings.widthRule.basis" :disabled="templateSettings.locked" :title="'当前依据属性类型：'+templateSettings.widthRule.type" @change="changeWidthRuleBasis()">
                    <option :value="item.name" v-if="item.type!=='long' && item.name!==''" v-for="item in templateSettings.detailsRule">{{item.name}}</option>
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
                  <div class="SheetRow RowText" v-for="(item,index) in templateSettings.widthRule.condition">
                    <div class="SheetCo0">
                      <span @click.stop="widthUp(index)" v-show="!switchDelMod3"><arrow-up></arrow-up></span>
                      <span @click.stop="widthDown(index)" v-show="!switchDelMod3"><arrow-down></arrow-down></span>
                      <span @click.stop="deleteWidth(index)" v-show="switchDelMod3"><trash-can></trash-can></span>
                    </div>
                    <div class="SheetCo7">
                      <div class="lopCo3" v-show="item.set">
                        <div class="listCo3">
                          <div class="itemCo3" v-for="(nn,oo) in allowType2Width" :class="item.type===oo?'pickCo3':''" @click.stop="()=>{item.type=oo;item.set=false}">{{nn}}</div>
                          <div class="itemCo3" style="color:#1ba903" @click.stop="()=>{item.set=false}">返回</div>
                        </div>
                      </div>
                      <div class="inputCo3" v-show="!item.set">
                        {{item.type}}
                      </div>
                      <div class="iconCo3" @click="item.set=true" v-show="!item.set && templateSettings.locked===false">
                        <dropdown-button></dropdown-button>
                      </div>
                      <div class="iconCo3" @click="alertTip('请先解锁模板')" v-show="templateSettings.locked===true">
                        <dropdown-button></dropdown-button>
                      </div>
                    </div>
                    <div class="SheetCo8">
                      <input class="SheetInput" type="text" v-model="item.value" :disabled="templateSettings.locked" @focus="onFocusMode()" @blur="noFocusMode()"/>
                    </div>
                    <div class="SheetCo9">
                      <input class="inpCo9" type="number" min="2" max="15" v-model="item.width" :disabled="templateSettings.locked"/>
                      <div class="widCo9">
                        <span  @click="()=>{if(!templateSettings.locked)item.width=2}">2</span>
                        <span  @click="()=>{if(!templateSettings.locked)item.width=4}">4</span>
                        <span  @click="()=>{if(!templateSettings.locked)item.width=8}">8</span>
                        <span  @click="()=>{if(!templateSettings.locked)item.width=12}">12</span>
                        <span  @click="()=>{if(!templateSettings.locked)item.width=15}">15</span>
                      </div>
                    </div>
                  </div>
                  <div class="SheetRow" v-show="templateSettings.widthRule.condition.length===0">
                    <div class="RowEmpty" @click="addWidthRule()" >Empty rule Click to add ✚</div>
                  </div>
                  <div class="SheetRow" v-show="templateSettings.widthRule.condition.length!==0">
                    <div class="RowButton" @click="addWidthRule()">Add new rule ✚</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="templateBottom">
        <button>下一步</button>
        <button>上一步</button>
        <button>取消</button>
        <button>应用</button>
      </div>
    </div>
    <div class="templateMenuClose"  @click.stop="closeTemplate()"  v-if="templateShow">

    </div>
  </div>
</template>

<script>
import ArrowDown from "./svgValidIcons/arrowDown";
import ArrowUp from "./svgValidIcons/arrowUp";
import DropdownButton from "./svgValidIcons/dropdownButton";
import TrashCan from "./svgValidIcons/trashCan";
export default {
  name: "BananaTemplateEdit",
  components:{
    DropdownButton,ArrowUp,ArrowDown,TrashCan,
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
      structure:null,
      templateShow:false,//模板设置显示
      templateNifty:2,//模板左侧显示页序号
      niftyList:[
        '模板使用方法','模板状态','设置基本类型',
        '设置属性规则', '设置颜色规则','设置宽度规则'
      ],
      localTemplate:[//本地模板
        {
          use:true,
          id:'000000',
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
        },
        {
          use:false,
          id:'222222',
          name:'公共园区模板',
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
      templateSettings:{
        id:null,
        name:null,
        creator:null,
        modify:null,
        locked:false,
        explain:null,
        typeRule:{
          point:true,
          line:true,
          area:true,
          curve:true,
        },
        detailsRule:[
          {
            set:false,//修改属性的状态
            name:'name',//属性名称
            default:'unknown',//默认值
            type:'text',//默认为文本
            length:100,//长度
            empty:true,//能否为空值
          }
        ],
        colorRule:{
          basis:null,
          type:null,
          condition:[

          ]
        },
        widthRule:{
          basis:null,
          type:null,
          condition:[

          ]
        }
      },
      switchDelMod1:false,
      switchDelMod2:false,
      switchDelMod3:false,
    }
  },
  mounted() {

  },
  methods:{
    changeWidthRuleBasis(){
      if(this.templateSettings.widthRule.basis===null
        || this.templateSettings.widthRule.basis===''
      ){
        return false;
      }
      let type='text';
      let basis=this.templateSettings.widthRule.basis;
      let len=this.templateSettings.detailsRule.length;
      for(let i=0;i<len;i++){//调整widthRule.type
        if(basis===this.templateSettings.detailsRule[i].name){
          type=this.templateSettings.detailsRule[i].type;
          break;
        }
      }
      this.templateSettings.widthRule.type=type;
      let condition=[];
      len=this.templateSettings.widthRule.condition.length;
      for(let q=0;q<len;q++){//过滤不可用的规则
        if(type==='bool' || type==='list' || type==='text'){
          if(this.templateSettings.widthRule.condition[q].type==='equ' || this.templateSettings.widthRule.condition[q].type==='nequ'){
            condition.push(this.templateSettings.widthRule.condition[q]);
          }
        }
        else if(type==='percent' || type==='date'){
          if(this.templateSettings.widthRule.condition[q].type==='equ' || this.templateSettings.widthRule.condition[q].type==='nequ'
            || this.templateSettings.widthRule.condition[q].type==='gre' || this.templateSettings.widthRule.condition[q].type==='greq'
            || this.templateSettings.widthRule.condition[q].type==='les' || this.templateSettings.widthRule.condition[q].type==='lesq'
          ){
            condition.push(this.templateSettings.widthRule.condition[q]);
          }
        }else if(type==='score' || type==='number'){
          condition.push(this.templateSettings.widthRule.condition[q]);
        }
      }
      this.templateSettings.widthRule.condition=condition;
    },
    changeColorRuleBasis(){
      if(this.templateSettings.colorRule.basis===null
      || this.templateSettings.colorRule.basis===''
      ){
        return false;
      }
      let type='text';
      let basis=this.templateSettings.colorRule.basis;
      let len=this.templateSettings.detailsRule.length;
      for(let i=0;i<len;i++){//调整colorRule.type
        if(basis===this.templateSettings.detailsRule[i].name){
          type=this.templateSettings.detailsRule[i].type;
          break;
        }
      }
      this.templateSettings.colorRule.type=type;
      let condition=[];
      len=this.templateSettings.colorRule.condition.length;
      for(let q=0;q<len;q++){//过滤不可用的规则
        if(type==='bool' || type==='list' || type==='text'){
          if(this.templateSettings.colorRule.condition[q].type==='equ' || this.templateSettings.colorRule.condition[q].type==='nequ'){
            condition.push(this.templateSettings.colorRule.condition[q]);
          }
        }
        else if(type==='percent' || type==='date'){
          if(this.templateSettings.colorRule.condition[q].type==='equ' || this.templateSettings.colorRule.condition[q].type==='nequ'
          || this.templateSettings.colorRule.condition[q].type==='gre' || this.templateSettings.colorRule.condition[q].type==='greq'
          || this.templateSettings.colorRule.condition[q].type==='les' || this.templateSettings.colorRule.condition[q].type==='lesq'
          ){
            condition.push(this.templateSettings.colorRule.condition[q]);
          }
        }else if(type==='score' || type==='number'){
          condition.push(this.templateSettings.colorRule.condition[q]);
        }
      }
      this.templateSettings.colorRule.condition=condition;
    },
    onFocusMode(){//聚焦模式
      this.$store.state.mapConfig.inputFocusStatus=true;
    },
    noFocusMode(){//非聚焦模式
      this.$store.state.mapConfig.inputFocusStatus=false;
    },
    openTemplate(){
      this.templateShow=true;
    },
    closeTemplate(){
      this.templateShow=false;
    },
    widthUp(index){
      if(this.templateSettings.locked){this.alertTip('请先解锁模板');return false;}
      if(index===0){
        this.$store.commit('setCoLogMessage',{text:'已经在最上方了',from:'internal:BananaTemplateEdit',type:'tip'});
        return false;
      }
      let temp=this.templateSettings.widthRule.condition[index];
      this.templateSettings.widthRule.condition[index]=this.templateSettings.widthRule.condition[index-1];
      this.templateSettings.widthRule.condition[index-1]=temp;
      this.templateSettings.widthRule.condition.push(null);
      this.templateSettings.widthRule.condition.pop();
    },
    widthDown(index){
      if(this.templateSettings.locked){this.alertTip('请先解锁模板');return false;}
      if(index+1>=this.templateSettings.widthRule.condition.length){
        this.$store.commit('setCoLogMessage',{text:'已经在最下方了',from:'internal:BananaTemplateEdit',type:'tip'});
        return false;
      }
      let temp=this.templateSettings.widthRule.condition[index];
      this.templateSettings.widthRule.condition[index]=this.templateSettings.widthRule.condition[index+1];
      this.templateSettings.widthRule.condition[index+1]=temp;
      this.templateSettings.widthRule.condition.push(null);
      this.templateSettings.widthRule.condition.pop();
    },
    deleteWidth(index){
      if(this.templateSettings.locked){this.alertTip('请先解锁模板');return false;}
      if(index>=this.templateSettings.widthRule.condition.length || index<0){
        return false;
      }
      this.templateSettings.widthRule.condition.splice(index,1);
    },
    colorUp(index){
      if(this.templateSettings.locked){this.alertTip('请先解锁模板');return false;}
      if(index===0){
        this.$store.commit('setCoLogMessage',{text:'已经在最上方了',from:'internal:BananaTemplateEdit',type:'tip'});
        return false;
      }
      let temp=this.templateSettings.colorRule.condition[index];
      this.templateSettings.colorRule.condition[index]=this.templateSettings.colorRule.condition[index-1];
      this.templateSettings.colorRule.condition[index-1]=temp;
      this.templateSettings.colorRule.condition.push(null);
      this.templateSettings.colorRule.condition.pop();
    },
    colorDown(index){
      if(this.templateSettings.locked){this.alertTip('请先解锁模板');return false;}
      if(index+1>=this.templateSettings.colorRule.condition.length){
        this.$store.commit('setCoLogMessage',{text:'已经在最下方了',from:'internal:BananaTemplateEdit',type:'tip'});
        return false;
      }
      let temp=this.templateSettings.colorRule.condition[index];
      this.templateSettings.colorRule.condition[index]=this.templateSettings.colorRule.condition[index+1];
      this.templateSettings.colorRule.condition[index+1]=temp;
      this.templateSettings.colorRule.condition.push(null);
      this.templateSettings.colorRule.condition.pop();
    },
    deleteColor(index){
      if(this.templateSettings.locked){this.alertTip('请先解锁模板');return false;}
      if(index>=this.templateSettings.colorRule.condition.length || index<0){
        return false;
      }
      this.templateSettings.colorRule.condition.splice(index,1);
    },
    switchTemplateNifty(serial){//切换模板右侧页面
      this.templateNifty=serial;
    },
    useLocalTemplate(id){//选择本地的模板
      if(this.templateSettings.locked){this.alertTip('请先解锁模板');return false;}
      this.localTemplate.forEach((item)=>{
        item.use=item.id===id;
      });
    },
    allowType(type){//更改模板
      if(this.templateSettings.locked){
        this.alertTip('请先解锁模板');return false;
      }
      let ct=0;
      for(let i in this.templateSettings.typeRule){
        if(this.templateSettings.typeRule.hasOwnProperty(i)){
          if(this.templateSettings.typeRule[i]===true){
            ct++;
          }
        }
      }
      if(ct<=1){
        this.alertTip('至少需要允许一种');return false;
      }
      this.templateSettings.typeRule[type]=!this.templateSettings.typeRule[type];
    },
    deleteDetails(index){
      if(this.templateSettings.locked){this.alertTip('请先解锁模板');return false;}
      if(index>=this.templateSettings.detailsRule.length || index<0){
        return false;
      }
      if(this.templateSettings.detailsRule.length<=1){
        this.$store.commit('setCoLogMessage',{text:'至少需要保留一个属性',from:'internal:BananaTemplateEdit',type:'tip'});
        return false;
      }
      if(this.templateSettings.detailsRule[index].name==='name'){
        this.$store.commit('setCoLogMessage',{text:'不能删除name属性',from:'internal:BananaTemplateEdit',type:'tip'});
        return false;
      }
      this.templateSettings.detailsRule.splice(index,1);
    },
    detailsDown(index){
      if(this.templateSettings.locked){this.alertTip('请先解锁模板');return false;}
      if(index+1>=this.templateSettings.detailsRule.length){
        this.$store.commit('setCoLogMessage',{text:'已经在最下方了',from:'internal:BananaTemplateEdit',type:'tip'});
        return false;
      }
      let temp=this.templateSettings.detailsRule[index];
      this.templateSettings.detailsRule[index]=this.templateSettings.detailsRule[index+1];
      this.templateSettings.detailsRule[index+1]=temp;
      this.templateSettings.detailsRule.push(null);
      this.templateSettings.detailsRule.pop();
    },
    detailsUp(index){
      if(this.templateSettings.locked){this.alertTip('请先解锁模板');return false;}
      if(index===0){
        this.$store.commit('setCoLogMessage',{text:'已经在最上方了',from:'internal:BananaTemplateEdit',type:'tip'});
        return false;
      }
      let temp=this.templateSettings.detailsRule[index];
      this.templateSettings.detailsRule[index]=this.templateSettings.detailsRule[index-1];
      this.templateSettings.detailsRule[index-1]=temp;
      this.templateSettings.detailsRule.push(null);
      this.templateSettings.detailsRule.pop();
    },
    addDetailsRule(){
      if(this.templateSettings.locked){this.alertTip('请先解锁模板');return false;}
      let obj=Object.create(null);
      obj.set=false;
      obj.name='';
      obj.default='unknown';
      obj.type='text';
      obj.length=100;
      obj.empty=true;
      this.templateSettings.detailsRule.push(obj);
    },
    addWidthRule(){
      if(this.templateSettings.locked){this.alertTip('请先解锁模板');return false;}
      if(this.templateSettings.widthRule.basis===null || this.templateSettings.widthRule.type===null){this.alertTip('请先选择宽度依据');return false;}
      let obj=Object.create(null);
      obj.set=false;
      obj.type='equ';
      obj.value='0';
      obj.width=2;
      this.templateSettings.widthRule.condition.push(obj);
    },
    addColorRule(){
      if(this.templateSettings.locked){this.alertTip('请先解锁模板');return false;}
      if(this.templateSettings.colorRule.basis===null || this.templateSettings.colorRule.type===null){this.alertTip('请先选择颜色依据');return false;}
      let obj=Object.create(null);
      obj.set=false;
      obj.type='equ';
      obj.value='0';
      obj.color='#000000';
      this.templateSettings.colorRule.condition.push(obj);
    },
    getTemplateId(){
      const validChars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const length = Math.floor(Math.random() * 7) + 6;
      let array = new Uint8Array(length);//输出长度为随机的6-12位
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
    }
  },
  computed:{
    overviewType(){
      let str=[];
      if(this.templateSettings.typeRule.area===true){
        str.push('Area');
      }
      if(this.templateSettings.typeRule.line===true){
        str.push('Line');
      }
      if(this.templateSettings.typeRule.point===true){
        str.push('point');
      }
      if(this.templateSettings.typeRule.curve===true){
        str.push('curve');
      }
      return str.join('、');
    },
    overviewDetails(){
      let str=[];
      let len=this.templateSettings.detailsRule.length;
      for(let i=0;i<len;i++){
        if(this.templateSettings.detailsRule[i].name!=''){
          str.push(this.templateSettings.detailsRule[i].name);
        }
      }
      return str.join('、');
    },
    overviewWidth(){
      let basis=this.templateSettings.widthRule.basis;
      if(basis===null || basis===''){
        return '无';
      }
      let str=[];
      let len=this.templateSettings.widthRule.condition.length;
      for(let i=0;i<len;i++){
        let sym=this.templateSettings.widthRule.condition[i].type;
        let val=this.templateSettings.widthRule.condition[i].value;
        let width=this.templateSettings.widthRule.condition[i].width;
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
    overviewColor(){
      let basis=this.templateSettings.colorRule.basis;
      if(basis===null || basis===''){
        return '无';
      }
      let str=[];
      let len=this.templateSettings.colorRule.condition.length;
      for(let i=0;i<len;i++){
        let sym=this.templateSettings.colorRule.condition[i].type;
        let val=this.templateSettings.colorRule.condition[i].value;
        let color=this.templateSettings.colorRule.condition[i].color;
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
    allowType2Width(){
      switch (this.templateSettings.widthRule.type) {
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
      switch (this.templateSettings.colorRule.type) {
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
    TemplateCode(){
      return this.$store.state.templateConfig.code;
    },
    /**
     * @return {array}
     */
    UsedStructure(){
      return this.$store.state.templateConfig.usedStructure;
    },
    basisAoe(){
      if(this.templateSettings.colorRule.basis===null || this.templateSettings.colorRule.basis===''){
        return '~无依据~';
      }
      return this.templateSettings.colorRule.basis;
    }
  },
  watch:{

    TemplateCode(){
      if(this.TemplateShow){
        this.openTemplate();
      }else {
        this.closeTemplate();
      }
    },
    UsedStructure(newValue){
      this.structure=newValue;
    },
  }
}
</script>

<style scoped>
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
.basisAoe{
  width: auto;
  min-width: 100px;
  padding-right: 5px;
  height: auto;
  font-weight: 800;
  font-size: 15px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.templateMenu{
  width: calc(50% - 30px);
  min-width: 690px;
  height: calc(60% - 30px);
  min-height: 410px;
  background: #ffffff;
  position: fixed;
  z-index: 558;
  top: 20%;
  left: 25%;
  padding: 15px;
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
  color: #ff28d4;
  margin: 5px 0px;
  cursor: default;
}
.NavigationLi{
  font-size: 15px;
  font-weight: 400;
  color: #ff7413;
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
  color: blue;
}
.templateTitle{
  width: 100%;
  height: 40px;
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
  height: calc(100% - 40px - 40px);
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
}
.templateRight{
  width: calc(100% - 180px - 40px);
  height: calc(100% - 40px);
  padding: 20px;
  box-shadow: inset 0px 0px 10px #e4e1e1;
}
.templateBottom{
  width: 100%;
  height: 40px;
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
