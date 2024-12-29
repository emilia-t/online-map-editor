<template>
  <div class="BananaTemplateEdit">
    <div class="templateMenu" @click.stop="void 0" v-if="templateShow">
      <div class="templateTitle">
        <span>模板设置：{{EditName}}</span>
      </div>
      <div class="templateContent">
        <div class="templateLeft">
          <div class="templateSel">
            <span :class="templateNifty===1?'nifty':'unNifty'" @click="switchTemplateNifty(1)" @mousedown.stop="playSoundEffect('confirm_1')">
              <doc-book/>&nbsp;&nbsp;使用说明
            </span>
          </div>
          <div class="templateSel">
            <span :class="templateNifty===2?'nifty':'unNifty'" @click="switchTemplateNifty(2)" @mousedown.stop="playSoundEffect('confirm_1')">
              <information-state/>&nbsp;&nbsp;信息状态
            </span>
          </div>
          <div class="templateSel">
            <span :class="templateNifty===3?'nifty':'unNifty'" @click="switchTemplateNifty(3)" @mousedown.stop="playSoundEffect('confirm_1')">
              <various-shapes/>&nbsp;&nbsp;基本类型
            </span>
          </div>
          <div class="templateSel">
            <span :class="templateNifty===4?'nifty':'unNifty'" @click="switchTemplateNifty(4)" @mousedown.stop="playSoundEffect('confirm_1')">
              <rule-list/>&nbsp;&nbsp;属性规则
            </span>
          </div>
          <div class="templateSel">
            <span :class="templateNifty===5?'nifty':'unNifty'" @click="switchTemplateNifty(5)" @mousedown.stop="playSoundEffect('confirm_1')">
              <rule-list/>&nbsp;&nbsp;颜色规则
            </span>
          </div>
          <div class="templateSel">
            <span :class="templateNifty===6?'nifty':'unNifty'" @click="switchTemplateNifty(6)" @mousedown.stop="playSoundEffect('confirm_1')">
              <rule-list/>&nbsp;&nbsp;宽度规则
            </span>
          </div>
        </div>
        <div class="templateRight">
          <div class="templateNifty" v-if="templateNifty===1"><!--模板使用方法-->
            <div class="HContent">
              <div class="textH1">
                模板使用说明
              </div>
              <div class="textH2">
                欢迎使用模板，在使用模板之前，您需要仔细阅读此说明书以更好的使用模板的相关功能，您在使用过程中如遇到任何问题请在此页面内寻找相应的帮助信息。
              </div>
              <div class="textH3">
                模板简介
              </div>
              <div class="textH2">
                模板，是分组图层内置的自定义规范条例。它可以用于限制成员元素类型，规范成员的属性，或依据某项属性来自动修改其地图元素的颜色、宽度。我们会在此文档中，逐一介绍模板的各项功能与使用方法。<span class="textH4">我们会在需要重点关注的地方使用红色字体以显著。</span>
              </div>
              <div class="textH3">
                模板状态
              </div>
              <div class="textH2">
                模板状态，是指该分组的模板的基本状态，有以下几种状态：1.正常，2.异常，3.空的，其中第3种状态是指此分组的模板不存在或为null值。如果模板状态为异常，则此分组模板无法正常运作，需要进行修复。
                <br/>
                <span class="textH4">*通常不会出现异常，但如果出现异常则需要服务端修复异常的模板*</span>
              </div>
              <div class="textH3">
                模板锁
              </div>
              <div class="textH2">
                模板锁，是用于防止模板被误修改的一种限制状态，当模板锁处于锁定状态时，所有的规则将无法编辑，也无法更新模板。
                <br/>
                <span class="textH4">要解锁模板，您可以依次点击“信息状态”->“锁定状态”->“(点击解锁)”解除锁定。</span>
              </div>
              <div class="textH3">
                设置基本类型
              </div>
              <div class="textH2">
                在“基本类型”页，可以设置该分组允许添加的元素类型，例如将一个名为“公交站点”的图层设置为仅允许“point”类型元素，则将除“point”类型元素之外的元素全部取消选中，然后点击“应用”即可。
                <br/>
                <span class="textH4">请注意，这些不允许的元素将会被自动删除。</span>
              </div>
              <div class="textH3">
                设置属性规则
              </div>
              <div class="textH2">
                所有地图元素的属性都是以键值对的形式存在的，“属性规则”页即是用于设置属性中“键”的名称、类型、默认值，这些属性会应用在新添加的元素之上，并且这些属性可以为后续的颜色规则和宽度规则提供依据
                <br/><br/>
                <span>----以下为属性规则页面的图示----</span>
                <br/><br/>
                <img class="diagram" src="../../static/diagram_1.jpg" alt="图示1">
                <br/>
                上图是操作按钮，从往右分别是 <span class="textH4">删除此行</span>、<span class="textH4">向上移动</span>、<span class="textH4">向下移动</span>
                <br/><br/>
                <img class="diagram" src="../../static/diagram_2.jpg" alt="图示1">
                <br/>
                上图是元素属性值的数据类型，从上往下分别是
                <br/>
                <br/>
                <span class="textH4">文本</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;普通的文本字符串类型
                <br/>
                <span class="textH4">数字</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;普通的数字类型
                <br/>
                  <span class="textH4">布尔</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;表示开或者关的数据类型
                <br/>
                  <span class="textH4">列表</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;表示单选项的数据类型
                <br/>
                  <span class="textH4">百分</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;表示百分比的数据类型
                <br/>
                  <span class="textH4">日期时间</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;特殊的数据类型，格式为"YYYY-MM-DDTHH:MM:SS"
                <br/>
                  <span class="textH4">日期</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;特殊的数据类型，格式为"YYYY-MM-DD"
                <br/>
                  <span class="textH4">时间</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;特殊的数据类型，格式为"HH:MM:SS"
                <br/><br/>
                <img class="diagram" src="../../static/diagram_3.jpg" alt="图示1">
                <br/>
                上图是布尔类型的属性值显示方式，左侧表示false，右侧表示true
                <br/><br/>
                <img class="diagram" src="../../static/diagram_4.jpg" alt="图示1">
                <br/>
                上图是一个单选项，点击右侧的倒三角按钮展开选项
                <br/><br/>
                <img class="diagram" src="../../static/diagram_5.jpg" height="40px" alt="图示1">
                <br/>
                上图是添加新增一行的按钮
              </div>
            </div>
            <div class="Navigation">
              <div class="NavigationTi"></div>
              <div class="NavigationLi">模板简介</div>
              <div class="NavigationLi">模板状态</div>
              <div class="NavigationLi">模板锁</div>
              <div class="NavigationLi">基本类型</div>
              <div class="NavigationLi">属性规则</div>
            </div>
          </div>
          <div class="templateNifty" v-if="templateNifty===2">
            <div class="TContent" >
              <div class="statusList cursorDefault">
                <div class="ListLeft">当前状态</div>
                <div class="ListRight" style="cursor:pointer" @click.stop="tpManualCheck()" @mousedown.stop="playSoundEffect('confirm_1')">{{templateStatus}}</div>
              </div>
              <div class="statusList cursorDefault">
                <div class="ListLeft">锁定状态</div>
                <div class="ListRight" style="cursor:pointer" @click.stop="lockUnlock()" v-show="!editTemplate.locked" @mousedown.stop="playSoundEffect('confirm_1')">未锁定(点击锁定)</div>
                <div class="ListRight" style="cursor:pointer" @click.stop="lockUnlock()" v-show="editTemplate.locked" @mousedown.stop="playSoundEffect('unconfirm_1')">已锁定(点击解锁)</div>
              </div>
              <div class="statusList">
                <div class="ListLeft cursorDefault">模板名称</div>
                <div class="ListRight">
                  <input class="statusInput" type="text" placeholder="未命名模板" v-model="editTemplate.name" :disabled="editTemplate.locked" @focus="onFocusMode()" @blur="noFocusMode()"/>
                </div>
              </div>
              <div class="statusList">
                <div class="ListLeft cursorDefault">描述信息</div>
                <div class="ListRight">
                  <textarea class="statusInput" type="text" placeholder="空的描述信息" v-model="editTemplate.explain" :disabled="editTemplate.locked" @focus="onFocusMode()" @blur="noFocusMode()"/>
                </div>
              </div>
              <div class="statusList cursorDefault">
                <div class="ListLeft">创建人员</div>
                <div class="ListRight">{{editTemplate.creator}}</div>
              </div>
              <div class="statusList cursorDefault">
                <div class="ListLeft">修改日期</div>
                <div class="ListRight">{{editTemplate.modify}}</div>
              </div>
              <div class="statusList cursorDefault">
                <div class="ListLeft">规则一览</div>
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
                        <div class="overviewText">{{item.str}}</div>
                        <div class="overviewText">{{item.tag}}</div>
                        <div class="overviewColor" :style="{background:item.color}"></div>
                      </div>
                  </div>
                  <div class="ListRightColor">
                    <div class="overviewStart">
                      宽度规则：
                    </div>
                    <div class="overviewRule" v-for="item in overviewWidth">
                      <div class="overviewText">{{item.str}}</div>
                      <div class="overviewText">{{item.tag}}</div>
                      <div class="overviewText">{{item.width}}</div>
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
                    <span  :style="viewBoxStyle(tmp)" @click="useLocalTemplate(tmp.id)" @mousedown.stop="normalClickSound()">
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
                    <span @click="allowType(type)" @mousedown.stop="allowTypeSound(type)">
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
                  在下方的表格中，点击填写或修改元素的属性规则。注意：在点击“应用”之前都可以再次修改以下规则，一旦点击了“应用”之后，不符合以下属性规则的元素将会被强制修改。另外，属性的名称不能为空，也不能重复。
                </div>
                <div class="detailsSheet">
                  <div class="SheetRow RowTitle">
                    <div class="SheetCo10">
                      操作
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
                  </div>
                  <div class="SheetRow RowText" :class="index===editTemplate.detailsRule.length-1?'lastRow':''" v-for="(item,index) in editTemplate.detailsRule">
                    <div class="rowTextOut" v-if="item.name==='name'">
                      <div class="SheetCo0">
                        <span/>
                      </div>
                      <div class="SheetCo0">
                        <span/>
                      </div>
                      <div class="SheetCo0">
                        <span/>
                      </div>
                      <div class="SheetCo1">
                        <input class="SheetInput" type="text" value="name" disabled="disabled"/>
                      </div>
                      <div class="SheetCo2">
                        <input class="SheetInput" type="text" value="unknown" disabled="disabled"/>
                      </div>
                      <div class="SheetCo3">
                        <div class="inputCo3">text</div>
                        <div class="iconCo3"/>
                      </div>
                    </div>
                    <div class="rowTextOut" v-if="item.name!=='name'">
                      <div class="SheetCo0">
                        <span @click.stop="deleteDetails(index)" @mousedown.stop="normalClickSound()"><trash-can/></span>
                      </div>
                      <div class="SheetCo0">
                        <span @click.stop="detailsUp(index)" @mousedown.stop="detailsUpSound(index)"><arrow-up/></span>
                      </div>
                      <div class="SheetCo0">
                        <span @click.stop="detailsDown(index)" @mousedown.stop="detailsDownSound(index)"><arrow-down/></span>
                      </div>
                      <div class="SheetCo1">
                        <input class="SheetInput" type="text" v-model="item.name"
                               :disabled="disabledA(item)"
                               @focus="onFocusMode()" @blur="noFocusMode()"/>
                      </div>
                      <div class="SheetCo2">
                        <pomelo-input :type="item.type" :value="item.default" :disabled="editTemplate.locked" :item="item" @inputChanged="detailsDefaultChanged"/>
                      </div>
                      <div class="SheetCo3" v-if="disabledA(item)">
                        <div class="inputCo3" v-text="item.type"/>
                        <div class="iconCo3"/>
                      </div>
                      <div class="SheetCo3" v-if="!disabledA(item)">
                        <div class="lopCo3" v-show="item.set">
                          <div class="listCo3">
                            <div class="itemCo3" :class="item.type==='text'?'pickCo3':''" @click.stop="()=>{       item.type='text';             item.set=false;   item.default='☍tunknown'}" @mousedown.stop="normalClickSound()">文本</div>
                            <div class="itemCo3" :class="item.type==='number'?'pickCo3':''" @click.stop="()=>{item.type='number';      item.set=false;   item.default=0}" @mousedown.stop="normalClickSound()">数字</div>
                            <div class="itemCo3" :class="item.type==='bool'?'pickCo3':''" @click.stop="()=>{     item.type='bool';             item.set=false;   item.default=false}" @mousedown.stop="normalClickSound()">布尔</div>
                            <div class="itemCo3" :class="item.type==='list'?'pickCo3':''" @click.stop="()=>{        item.type='list';                item.set=false;   item.default='☍lunknown'}" @mousedown.stop="normalClickSound()">列表</div>
                            <div class="itemCo3" :class="item.type==='percent'?'pickCo3':''" @click.stop="()=>{item.type='percent';       item.set=false;   item.default='☍p0%'}" @mousedown.stop="normalClickSound()">百分比</div>
                            <div class="itemCo3" :class="item.type==='datetime'?'pickCo3':''" @click.stop="()=>{item.type='datetime';  item.set=false;   item.default='☍e2020-01-01T00:00:00'}" @mousedown.stop="normalClickSound()">日期时间</div>
                            <div class="itemCo3" :class="item.type==='date'?'pickCo3':''" @click.stop="()=>{     item.type='date';             item.set=false;   item.default='☍d2020-01-01'}" @mousedown.stop="normalClickSound()">日期</div>
                            <div class="itemCo3" :class="item.type==='time'?'pickCo3':''" @click.stop="()=>{     item.type='time';             item.set=false;   item.default='☍m00:00:00'}" @mousedown.stop="normalClickSound()">时间</div>
                            <div class="itemCo3" style="color:#1ba903" @click.stop="item.set=false" @mousedown.stop="playSoundEffect('unconfirm_1')">返回</div>
                          </div>
                        </div>
                        <div class="inputCo3" v-show="!item.set" v-text="item.type">
                        </div>
                        <div class="iconCo3" @click="item.set=true" @mousedown.stop="normalClickSound()" v-show="!item.set && editTemplate.locked===false">
                          <dropdown-button/>
                        </div>
                        <div class="iconCo3" @click="alertTip('请先解锁模板')" @mousedown.stop="normalClickSound()" v-show="editTemplate.locked===true">
                          <dropdown-button/>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="SheetRow">
                    <div class="RowButton" @click="addDetailsRule()" @mousedown.stop="normalClickSound()">Add New ✚</div>
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
                  通过依据某项属性自动为成员设置颜色。注意：在点击“应用”之前都可以再次修改此项规则，一旦点击了“应用”之后，此分组内的所有元素成员将会按以下规则自动设置颜色同时会按照参数值自动形成分组，并且无法手动修改元素的颜色。
                </div>
                <div class="setTitle">
                  颜色依据
                </div>
                <div class="setExplain">
                  点击下方按钮选择其中一个属性作为颜色的依据。
                </div>
                <div class="setChoice">
                  <div v-text="editTemplate.colorRule.basis===''?'请选择':editTemplate.colorRule.basis">
                  </div>
                  <div class="basisCo2" v-show="setColorBasis">
                    <div class="basisCo3" v-for="item in editTemplate.detailsRule"
                         v-text="item.name"
                         :class="item.name===editTemplate.colorRule.basis?'pickCo3':''"
                         @click.stop="changeColorRuleBasis(item.name,item.type)"
                         @mousedown.stop="normalClickSound()"
                         v-if="item.name!=='' && item.type!=='long'">
                    </div>
                    <div class="basisCo3" style="color:#1ba903" @click.stop="setColorBasis=false" @mousedown.stop="playSoundEffect('unconfirm_1')">返回</div>
                    <div class="basisCo3" style="color:#1ba903" @click.stop="restoreColorRule()" @mousedown.stop="playSoundEffect('unconfirm_1')">重置</div>
                  </div>
                  <div class="iconCo3" @click="setColorBasis=true" @mousedown.stop="normalClickSound()" v-show="!setColorBasis && editTemplate.locked===false">
                    <dropdown-button custom="transform:translateX(2px)"/>
                  </div>
                  <div class="iconCo3" @click="alertTip('请先解锁模板')" @mousedown.stop="normalClickSound()" v-show="editTemplate.locked===true">
                    <dropdown-button custom="transform:translateX(2px)"/>
                  </div>
                </div>
                <div class="setTitle">
                  条件规则
                </div>
                <div class="setExplain">
                  在下方的表格中，点击添加和修改颜色的条件规则。
                </div>
                <div class="detailsSheet">
                  <div class="SheetRow RowTitle">
                    <div class="SheetCo10">
                      操作
                    </div>
                    <div class="SheetCo7">
                      方法
                    </div>
                    <div class="SheetCo8">
                      参数
                    </div>
                    <div class="SheetCo9">
                      颜色
                    </div>
                  </div>
                  <div class="SheetRow RowText"  :class="index===editTemplate.colorRule.condition.length-1?'lastRow':''" v-for="(item,index) in editTemplate.colorRule.condition">
                    <div class="SheetCo0">
                      <span @click.stop="deleteColor(index)" @mousedown.stop="normalClickSound()"><trash-can/></span>
                    </div>
                    <div class="SheetCo0">
                      <span @click.stop="colorUp(index)" @mousedown.stop="colorUpSound(index)"><arrow-up/></span>
                    </div>
                    <div class="SheetCo0">
                      <span @click.stop="colorDown(index)" @mousedown.stop="colorDownSound(index)"><arrow-down/></span>
                    </div>
                    <div class="SheetCo7">
                      <div class="lopCo3" v-show="item.set">
                        <div class="listCo3">
                          <div class="itemCo3" v-for="(nn,oo) in allowType2Color" :class="item.method===oo?'pickCo3':''" @click.stop="()=>{item.method=oo;item.set=false}" @mousedown.stop="playSoundEffect('confirm_1')">{{nn}}</div>
                          <div class="itemCo3" style="color:#1ba903" @click.stop="()=>{item.set=false}" @mousedown.stop="playSoundEffect('unconfirm_1')">返回</div>
                        </div>
                      </div>
                      <div class="inputCo3" v-show="!item.set">
                        {{item.method}}
                      </div>
                      <div class="iconCo3" @click="item.set=true" @mousedown.stop="normalClickSound()" v-show="!item.set && editTemplate.locked===false">
                        <dropdown-button/>
                      </div>
                      <div class="iconCo3" @click="alertTip('请先解锁模板')" @mousedown.stop="normalClickSound()" v-show="editTemplate.locked===true">
                        <dropdown-button/>
                      </div>
                    </div>
                    <div class="SheetCo8">
                      <pomelo-input :type="editTemplate.colorRule.type" :value="item.value" :disabled="editTemplate.locked" :ruleMethod="item.method" :item="item" @inputChanged="detailsValueChanged"/>
                    </div>
                    <div class="SheetCo9">
                      <input class="inpCo9" type="color" v-model="item.color" :disabled="editTemplate.locked"/>
                      <div class="colCo9">
                        <div class="lisCo9" v-for="color in colors" :style="'background:'+color" @click="()=>{if(!editTemplate.locked)item.color=color}" @mousedown.stop="normalClickSound()"></div>
                      </div>
                    </div>
                  </div>
                  <div class="SheetRow" v-show="editTemplate.colorRule.condition.length===0">
                    <div class="RowEmpty" @click="addColorRule()" @mousedown.stop="addColorRuleSound()">Empty rule Click to add ✚</div>
                  </div>
                  <div class="SheetRow" v-show="editTemplate.colorRule.condition.length!==0">
                    <div class="RowButton" @click="addColorRule()" @mousedown.stop="addColorRuleSound()">Add new rule ✚</div>
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
                  通过依据某项属性自动为成员设置宽度。注意：在点击“应用”之前都可以再次修改此项规则，一旦点击了“应用”之后，此分组内的所有元素将会按下面的规则自动设置宽度，并且无法手动调整宽度。
                </div>
                <div class="setTitle">
                  宽度依据
                </div>
                <div class="setExplain">
                  点击下方按钮选择其中一个属性作为宽度的依据。
                </div>
                <div class="setChoice">
                  <div v-text="editTemplate.widthRule.basis===''?'请选择':editTemplate.widthRule.basis">
                  </div>
                  <div class="basisCo2" v-show="setWidthBasis">
                    <div class="basisCo3" v-for="item in editTemplate.detailsRule"
                         v-text="item.name"
                         :class="item.name===editTemplate.widthRule.basis?'pickCo3':''"
                         @click.stop="changeWidthRuleBasis(item.name,item.type)"
                         @mousedown.stop="normalClickSound()"
                         v-if="item.name!=='' && item.type!=='long'">
                    </div>
                    <div class="basisCo3" style="color:#1ba903" @click.stop="setWidthBasis=false" @mousedown.stop="playSoundEffect('unconfirm_1')">返回</div>
                    <div class="basisCo3" style="color:#1ba903" @click.stop="restoreWidthRule()" @mousedown.stop="playSoundEffect('unconfirm_1')">重置</div>
                  </div>
                  <div class="iconCo3" @click="setWidthBasis=true" @mousedown.stop="normalClickSound()" v-show="!setWidthBasis && editTemplate.locked===false">
                    <dropdown-button custom="margin-left:2px"/>
                  </div>
                  <div class="iconCo3" @click="alertTip('请先解锁模板')" @mousedown.stop="normalClickSound()" v-show="editTemplate.locked===true">
                    <dropdown-button custom="margin-left:2px"/>
                  </div>
                </div>
                <div class="setTitle">
                  条件规则
                </div>
                <div class="setExplain">
                  在下方的表格中，点击添加和修改宽度的条件规则。
                </div>
                <div class="detailsSheet">
                  <div class="SheetRow RowTitle">
                    <div class="SheetCo10">
                      操作
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
                  <div class="SheetRow RowText" :class="index===editTemplate.widthRule.condition.length-1?'lastRow':''" v-for="(item,index) in editTemplate.widthRule.condition">
                    <div class="SheetCo0">
                      <span @click.stop="deleteWidth(index)" @mousedown.stop="normalClickSound()"><trash-can/></span>
                    </div>
                    <div class="SheetCo0">
                      <span @click.stop="widthUp(index)" @mousedown.stop="widthUpSound(index)"><arrow-up/></span>
                    </div>
                    <div class="SheetCo0">
                      <span @click.stop="widthDown(index)" @mousedown.stop="widthDownSound(index)"><arrow-down/></span>
                    </div>
                    <div class="SheetCo7">
                      <div class="lopCo3" v-show="item.set">
                        <div class="listCo3">
                          <div class="itemCo3" v-for="(nn,oo) in allowType2Width" :class="item.method===oo?'pickCo3':''" @click.stop="()=>{item.method=oo;item.set=false}" @mousedown.stop="playSoundEffect('confirm_1')">{{nn}}</div>
                          <div class="itemCo3" style="color:#1ba903" @click.stop="()=>{item.set=false}" @mousedown.stop="playSoundEffect('unconfirm_1')">返回</div>
                        </div>
                      </div>
                      <div class="inputCo3" v-show="!item.set">
                        {{item.method}}
                      </div>
                      <div class="iconCo3" @click="item.set=true" @mousedown.stop="normalClickSound()" v-show="!item.set && editTemplate.locked===false">
                        <dropdown-button/>
                      </div>
                      <div class="iconCo3" @click="alertTip('请先解锁模板')" @mousedown.stop="normalClickSound()" v-show="editTemplate.locked===true">
                        <dropdown-button/>
                      </div>
                    </div>
                    <div class="SheetCo8">
                      <pomelo-input :type="editTemplate.widthRule.type" :value="item.value" :disabled="editTemplate.locked" :item="item" @inputChanged="detailsValueChanged"/>
                    </div>
                    <div class="SheetCo9">
                      <input class="inpCo9" type="number" min="2" max="15" v-model.number="item.width" :disabled="editTemplate.locked"/>
                      <div class="widCo9">
                        <span  @click="()=>{if(!editTemplate.locked)item.width=2}" @mousedown.stop="normalClickSound()">2</span>
                        <span  @click="()=>{if(!editTemplate.locked)item.width=4}" @mousedown.stop="normalClickSound()">4</span>
                        <span  @click="()=>{if(!editTemplate.locked)item.width=8}" @mousedown.stop="normalClickSound()">8</span>
                        <span  @click="()=>{if(!editTemplate.locked)item.width=12}" @mousedown.stop="normalClickSound()">12</span>
                        <span  @click="()=>{if(!editTemplate.locked)item.width=15}" @mousedown.stop="normalClickSound()">15</span>
                      </div>
                    </div>
                  </div>
                  <div class="SheetRow" v-show="editTemplate.widthRule.condition.length===0">
                    <div class="RowEmpty" @click="addWidthRule()" @mousedown.stop="addWidthRuleSound()">Empty rule Click to add ✚</div>
                  </div>
                  <div class="SheetRow" v-show="editTemplate.widthRule.condition.length!==0">
                    <div class="RowButton" @click="addWidthRule()" @mousedown.stop="addWidthRuleSound()">Add new rule ✚</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="templateBottom">
        <button @click.stop="niftyBack()" @mousedown.stop="playSoundEffect('confirm_1')">上一步</button>
        <button @click.stop="niftyNext()" @mousedown.stop="playSoundEffect('confirm_1')">下一步</button>
        <button @click.stop="closeAndCancel()" @mousedown.stop="playSoundEffect('unconfirm_1')">取消</button>
        <button @click.stop="submitEdit()" @mousedown.stop="playSoundEffect('confirm_1')">应用</button>
      </div>
    </div>
    <div class="templateMenuClose"  @click.stop="closeAndCancel()" @mousedown.stop="playSoundEffect('unconfirm_1')"  v-if="templateShow"/>
    <pomelo-confirm
      :view="firmView"
      :plan="firmPlan"
      :message="firmMessage"
      @confirm="handleConfirm">
    </pomelo-confirm>
  </div>
</template>

<script>
  import PomeloInput from "./PomeloInput";
  import ArrowDown from "./svgValidIcons/arrowDown";
  import ArrowUp from "./svgValidIcons/arrowUp";
  import DropdownButton from "./svgValidIcons/dropdownButton";
  import TrashCan from "./svgValidIcons/trashCan";
  import PomeloConfirm from "./PomeloConfirm";
  import DocBook from "./svgValidIcons/40X/docBook";
  import InformationState from "./svgValidIcons/40X/informationState";
  import VariousShapes from "./svgValidIcons/40X/variousShapes";
  import RuleList from "./svgValidIcons/40X/ruleList";

  export default {
  name: "BananaTemplateEdit",
  components:{DocBook,InformationState,VariousShapes,RuleList,
    DropdownButton,ArrowUp,ArrowDown,TrashCan,PomeloConfirm,PomeloInput
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
      localTemplate:[//本地模板
        {
          use:false,
          id:'100000',
          name:'空的模板',
          creator:'Emilia-t',
          modify:'2024-04-16T00:00:00',
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
            {set:false,name:'name',default:'☍tunknown',type:'text'}
          ],
          colorRule:{
            basis:'',type:'',
            condition:[]
          },
          widthRule:{
            basis:'',type:'',
            condition:[]
          }
        },
        {
          use:false,
          id:'111111',
          name:'标准的模板',
          creator:'Emilia-t',
          modify:'2024-04-16T00:00:00',
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
            {set:false,name:'name',default:'☍tunknown',type:'text'},
            {set:false,name:'grade',default:'☍tunknown',type:'text'},
            {set:false,name:'region',default:'☍tunknown',type:'text'},
            {set:false,name:'address',default:'☍tunknown',type:'text'},
            {set:false,name:'telephone',default:'☍tunknown',type:'text'}
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
            basis:'',
            type:'',
            condition: []
          }
        }
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
            default:'☍tunknown',
            type:'text',
            length:2000,
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
      firmView:false,//确认菜单
      firmPlan:{},
      firmMessage:'',
      tmpProof:null,
      setColorBasis:false,
      setWidthBasis:false
    }
  },
  mounted(){
    this.tmpProof=new this.$store.state.classList.tmpProof('chinese');
  },
  methods:{
    playSoundEffect(name){
      this.$store.commit('setCoEffectsSound',name);
    },
    detailsDefaultChanged(data){
      data.item.default=data.value;
    },
    detailsValueChanged(data){
      data.item.value=data.value;
    },
    niftyBack(){//上一步骤
      if(this.templateNifty===1)return false;
      this.templateNifty--
    },
    niftyNext(){//下一步骤
      if(this.templateNifty===6)return false;
      this.templateNifty++
    },
    resetUI(){//还原部分UI界面
      this.templateNifty=1;//还原模板设置页面左侧的按钮
      this.setColorBasis=false;
      this.setWidthBasis=false;
      for(let i=0;i<this.localTemplate.length;i++){//还原快速应用模板的界面
        this.localTemplate[i].use=false;
      }
    },
    getFormattedDate() {//获取模板时间
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份是从0开始的
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    },
    lockUnlock(){
      this.editTemplate.locked=!this.editTemplate.locked;
      if(this.editTemplate.locked){
        this.setWidthBasis=false;
        this.setColorBasis=false;
      }
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
    changeWidthRuleBasis(basis,type){//宽度依据重新选择后的事件
      this.setWidthBasis=false;//关闭依据选框
      this.firmPlan={method:'changeWidthRuleBasis',value:{basis,type}};
      this.firmMessage='更换依据会清除部分宽度规则，是否要继续？';
      this.firmView=true;//呼出确认菜单
    },
    changeColorRuleBasis(basis,type){//颜色依据重新选择后的事件
      this.setColorBasis=false;//关闭依据选框
      this.firmPlan={method:'changeColorRuleBasis',value:{basis,type}};
      this.firmMessage='更换依据会清除部分颜色规则，是否要继续？';
      this.firmView=true;//呼出确认菜单
    },
    restoreWidthRule(){//重置宽度规则
      this.setWidthBasis=false;//关闭依据选框
      this.firmPlan={method:'restoreWidthRule',value:null};
      this.firmMessage='重置依据会清除所有宽度规则，是否要继续？';
      this.firmView=true;//呼出确认菜单
    },
    restoreColorRule(){//重置颜色规则
      this.setColorBasis=false;//关闭依据选框
      this.firmPlan={method:'restoreColorRule',value:null};
      this.firmMessage='重置依据会清除所有颜色规则，是否要继续？';
      this.firmView=true;//呼出确认菜单
    },
    handleConfirm(plan){//一些需要再次确认才能执行的操作
      let method=plan.method;
      let value=plan.value;//确认执行时的操作
      if(plan.state){//确认执行时的操作
        this.firmView=false;//关闭确认菜单
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
            let ckCode=this.tmpProof.tpCheck(template);
            if(ckCode!==true){//检查不通过
              let text='';
              text=this.tmpProof.codeExplain(ckCode);
              this.$store.commit('setCoLogMessage',{text:text,from:'internal:BananaTemplateEdit',type:'tip'});
              return false;
            }else {//检查通过
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
          case 'changeColorRuleBasis':{
            let basis=value.basis;
            let type=value.type;
            let condition=[];
            let len=0;
            this.editTemplate.colorRule.type=type;
            this.editTemplate.colorRule.basis=basis;
            /**
             * 过滤不可用的规则
             **/
            len=this.editTemplate.colorRule.condition.length;
            for(let q=0;q<len;q++){
              if(type==='bool' || type==='list' || type==='text'){
                if(this.editTemplate.colorRule.condition[q].method==='equ' || this.editTemplate.colorRule.condition[q].method==='nequ'){
                  condition.push(this.editTemplate.colorRule.condition[q]);
                }
              }
              else if(type==='percent' || type==='datetime' || type==='date' || type==='time'){
                if(this.editTemplate.colorRule.condition[q].method==='equ' || this.editTemplate.colorRule.condition[q].method==='nequ'
                  || this.editTemplate.colorRule.condition[q].method==='gre' || this.editTemplate.colorRule.condition[q].method==='greq'
                  || this.editTemplate.colorRule.condition[q].method==='les' || this.editTemplate.colorRule.condition[q].method==='lesq'
                ){
                  condition.push(this.editTemplate.colorRule.condition[q]);
                }
              }else if(type==='number'){
                condition.push(this.editTemplate.colorRule.condition[q]);
              }
            }
            /**
             * 转化旧规则中的value值
             **/
            len=condition.length;
            for(let s=0;s<len;s++){
              let oldV=condition[s].value;
              let newV=this.tmpProof.conversion(oldV,type);
              condition[s].value=newV;
            }
            this.editTemplate.colorRule.condition=condition;
            break;
          }
          case 'changeWidthRuleBasis':{
            let basis=value.basis;
            let type=value.type;
            let condition=[];
            let len=0;
            this.editTemplate.widthRule.type=type;
            this.editTemplate.widthRule.basis=basis;
            /**
             * 过滤不可用的规则
             **/
            len=this.editTemplate.widthRule.condition.length;
            for(let q=0;q<len;q++){
              if(type==='bool' || type==='list' || type==='text'){
                if(this.editTemplate.widthRule.condition[q].method==='equ' || this.editTemplate.widthRule.condition[q].method==='nequ'){
                  condition.push(this.editTemplate.widthRule.condition[q]);
                }
              }
              else if(type==='percent' || type==='datetime' || type==='date' || type==='time'){
                if(this.editTemplate.widthRule.condition[q].method==='equ' || this.editTemplate.widthRule.condition[q].method==='nequ'
                  || this.editTemplate.widthRule.condition[q].method==='gre' || this.editTemplate.widthRule.condition[q].method==='greq'
                  || this.editTemplate.widthRule.condition[q].method==='les' || this.editTemplate.widthRule.condition[q].method==='lesq'
                ){
                  condition.push(this.editTemplate.widthRule.condition[q]);
                }
              }else if(type==='number'){
                condition.push(this.editTemplate.widthRule.condition[q]);
              }
            }
            /**
             * 转化旧规则中的value值
             **/
            len=condition.length;
            for(let s=0;s<len;s++){
              let oldV=condition[s].value;
              let newV=this.tmpProof.conversion(oldV,type);
              condition[s].value=newV;
            }
            this.editTemplate.widthRule.condition=condition;
            break;
          }
          case 'restoreColorRule':{
            this.editTemplate.colorRule.basis='';
            this.editTemplate.colorRule.type='';
            this.editTemplate.colorRule.condition.length=0;
            break;
          }
          case 'restoreWidthRule':{
            this.editTemplate.widthRule.basis='';
            this.editTemplate.widthRule.type='';
            this.editTemplate.widthRule.condition.length=0;
            break;
          }
        }
      }
      else{//取消执行时的操作
        this.firmView=false;//关闭确认菜单
        switch(method){

        }
      }
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
      if(index<=0){
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
    addWidthRuleSound(){
      if(this.editTemplate.locked){this.playSoundEffect('unable_1');return false;}
      if(this.editTemplate.widthRule.basis===null || this.editTemplate.widthRule.type===null){this.playSoundEffect('unable_1');return false;}
      if(this.editTemplate.widthRule.basis==='' || this.editTemplate.widthRule.type===''){this.playSoundEffect('unable_1');return false;}
      this.playSoundEffect('confirm_1');
    },
    addColorRuleSound(){
      if(this.editTemplate.locked){this.playSoundEffect('unable_1');return false;}
      if(this.editTemplate.colorRule.basis===null || this.editTemplate.colorRule.type===null){this.playSoundEffect('unable_1');return false;}
      if(this.editTemplate.colorRule.basis==='' || this.editTemplate.colorRule.type===''){this.playSoundEffect('unable_1');return false;}
      this.playSoundEffect('confirm_1');
    },
    normalClickSound(){
      if(this.editTemplate.locked){
        this.playSoundEffect('unable_1');return false;
      }
      this.playSoundEffect('confirm_1');
    },
    widthUpSound(index){
      if(this.editTemplate.locked){
        this.playSoundEffect('unable_1');return false;
      }
      if(index<=0){
        this.playSoundEffect('unable_1');return false;
      }
      this.playSoundEffect('confirm_1');
    },
    widthDownSound(index){
      if(this.editTemplate.locked){
        this.playSoundEffect('unable_1');return false;
      }
      if(index+1>=this.editTemplate.widthRule.condition.length){
        this.playSoundEffect('unable_1');return false;
      }
      this.playSoundEffect('confirm_1');
    },
    colorUpSound(index){
      if(this.editTemplate.locked){
        this.playSoundEffect('unable_1');return false;
      }
      if(index<=0){
        this.playSoundEffect('unable_1');return false;
      }
      this.playSoundEffect('confirm_1');
    },
    colorDownSound(index){
      if(this.editTemplate.locked){
        this.playSoundEffect('unable_1');return false;
      }
      if(index+1>=this.editTemplate.colorRule.condition.length){
        this.playSoundEffect('unable_1');return false;
      }
      this.playSoundEffect('confirm_1');
    },
    detailsUpSound(index){
      if(this.editTemplate.locked){
        this.playSoundEffect('unable_1');return false;
      }
      if(index<=1){
        this.playSoundEffect('unable_1');return false;
      }
      this.playSoundEffect('confirm_1');
    },
    detailsDownSound(index){
      if(this.editTemplate.locked){
        this.playSoundEffect('unable_1');return false;
      }
      if(index+1>=this.editTemplate.detailsRule.length){
        this.playSoundEffect('unable_1');return false;
      }
      this.playSoundEffect('confirm_1');
    },
    allowTypeSound(type){
      if(this.editTemplate.locked){
        this.playSoundEffect('unable_1');return false;
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
        this.playSoundEffect('unable_1');return false;
      }
      this.editTemplate.typeRule[type]?this.playSoundEffect('unconfirm_1'):this.playSoundEffect('confirm_1');
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
      const Name=this.editTemplate.detailsRule[index].name;
      if(this.editTemplate.detailsRule.length<=1){
        this.$store.commit('setCoLogMessage',{text:'至少需要保留一个属性',from:'internal:BananaTemplateEdit',type:'tip'});
        return false;
      }
      if(Name==='name'){
        this.$store.commit('setCoLogMessage',{text:'不能删除name属性',from:'internal:BananaTemplateEdit',type:'tip'});
        return false;
      }
      if(Name===this.editTemplate.colorRule.basis && Name!==''){
        this.$store.commit('setCoLogMessage',{text:'无法删除，因为颜色规则依据此属性',from:'internal:BananaTemplateEdit',type:'tip'});
        return false;
      }
      if(Name===this.editTemplate.widthRule.basis && Name!==''){
        this.$store.commit('setCoLogMessage',{text:'无法删除，因为宽度规则依据此属性',from:'internal:BananaTemplateEdit',type:'tip'});
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
      if(index<=1){
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
      obj.default='☍tunknown';
      obj.type='text';
      this.editTemplate.detailsRule.push(obj);
    },
    addWidthRule(){
      if(this.editTemplate.locked){this.alertTip('请先解锁模板');return false;}
      if(this.editTemplate.widthRule.basis===null || this.editTemplate.widthRule.type===null){this.alertTip('请先选择宽度依据');return false;}
      if(this.editTemplate.widthRule.basis==='' || this.editTemplate.widthRule.type===''){this.alertTip('请先选择宽度依据');return false;}
      let obj=Object.create(null);
      let wType='';
      wType=this.editTemplate.widthRule.type;
      if(wType==='text'){//依据宽度依据类型给定默认value
        obj.value='☍tunknown';
      }
      else if(wType==='list'){
        obj.value='☍lunknown';
      }
      else if(wType==='number'){
        obj.value=0;
      }
      else if(wType==='percent'){
        obj.value='☍p0%';
      }
      else if(wType==='datetime'){
        obj.value="☍e2020-01-01T00:00:00";
      }
      else if(wType==='date'){
        obj.value="☍d2020-01-01";
      }
      else if(wType==='time'){
        obj.value="☍m00:00:00";
      }
      else if(wType==='bool'){
        obj.value=false;
      }
      obj.set=false;
      obj.method='equ';
      obj.width=2;
      this.editTemplate.widthRule.condition.push(obj);
    },
    addColorRule(){
      if(this.editTemplate.locked){this.alertTip('请先解锁模板');return false;}
      if(this.editTemplate.colorRule.basis===null || this.editTemplate.colorRule.type===null){this.alertTip('请先选择颜色依据');return false;}
      if(this.editTemplate.colorRule.basis==='' || this.editTemplate.colorRule.type===''){this.alertTip('请先选择颜色依据');return false;}
      let obj=Object.create(null);
      let cType='';
      cType=this.editTemplate.colorRule.type;
      if(cType==='text'){//依据颜色依据类型给定默认value
        obj.value='☍tunknown';
      }
      else if(cType==='list'){
        obj.value='☍lunknown';
      }
      else if(cType==='number'){
        obj.value=0;
      }
      else if(cType==='percent'){
        obj.value='☍p0%';
      }
      else if(cType==='datetime'){
        obj.value="☍e2020-01-01T00:00:00";
      }
      else if(cType==='date'){
        obj.value="☍d2020-01-01";
      }
      else if(cType==='time'){
        obj.value="☍m00:00:00";
      }
      else if(cType==='bool'){
        obj.value=false;
      }
      obj.set=false;
      obj.method='equ';
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
      let checkCode=this.tmpProof.tpCheck(this.editTemplate);
      if(checkCode!==true){
        let text='';
        text=this.tmpProof.codeExplain(checkCode);
        this.$store.commit('setCoLogMessage',{text:'模板存在异常：'+text,from:'internal:BananaTemplateEdit',type:'warn'});
        this.tpRepair();
      }else {
        this.$store.commit('setCoLogMessage',{text:'模板检查结果：正常',from:'internal:BananaTemplateEdit',type:'tip'});
      }
    },
    disabledA(item){
      if(this.editTemplate.locked)return true;
      if(item.name===this.editTemplate.colorRule.basis && item.name!=='')return true;
      return item.name === this.editTemplate.widthRule.basis && item.name !== '';
    },
  },
  computed:{
    templateStatus(){
      if(this.editTemplate===null)return '空的';
      if(this.tmpProof.tpCheck(this.editTemplate)===true)return '正常(点击检查)';
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
      let tag='⇒';
      for(let i=0;i<len;i++){
        let sym=this.editTemplate.widthRule.condition[i].method;
        let val=this.editTemplate.widthRule.condition[i].value;
        let width=this.editTemplate.widthRule.condition[i].width;
        switch (sym){
          case 'equ':{
            str.push({
              str:basis+' = '+val,width,tag
            });
            break;
          }
          case 'nequ':{
            str.push({
              str:basis+' ≠ '+val,width,tag
            });
            break;
          }
          case 'gre':{
            str.push({
              str:basis+' > '+val,width,tag
            });
            break;
          }
          case 'greq':{
            str.push({
              str:basis+' ≥ '+val,width,tag
            });
            break;
          }
          case 'les':{
            str.push({
              str:basis+' < '+val,width,tag
            });
            break;
          }
          case 'lesq':{
            str.push({
              str:basis+' ≤ '+val,width,tag
            });
            break;
          }
          case 'mod0':{
            str.push({
              str:basis+' mod '+val+' = 0',width,tag
            });
            break;
          }
          case 'nmod0':{
            str.push({
              str:basis+' mod '+val+' ≠ 0',width,tag
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
      let tag='⇒';
      let len=this.editTemplate.colorRule.condition.length;
      for(let i=0;i<len;i++){
        let sym=this.editTemplate.colorRule.condition[i].method;
        let val=this.editTemplate.colorRule.condition[i].value;
        let color=this.editTemplate.colorRule.condition[i].color;
        switch (sym){
          case 'equ':{
            str.push({
              str:basis+' = '+val,color,tag
            });
            break;
          }
          case 'nequ':{
            str.push({
              str:basis+' ≠ '+val,color,tag
            });
            break;
          }
          case 'gre':{
            str.push({
              str:basis+' > '+val,color,tag
            });
            break;
          }
          case 'greq':{
            str.push({
              str:basis+' ≥ '+val,color,tag
            });
            break;
          }
          case 'les':{
            str.push({
              str:basis+' < '+val,color,tag
            });
            break;
          }
          case 'lesq':{
            str.push({
              str:basis+' ≤ '+val,color,tag
            });
            break;
          }
          case 'mod0':{
            str.push({
              str:basis+' mod '+val+' = 0',color,tag
            });
            break;
          }
          case 'nmod0':{
            str.push({
              str:basis+' mod '+val+' ≠ 0',color,tag
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
        case 'list':{
          return {'equ':'等于','nequ':'不等于'};
        }
        case 'bool':{
          return {'equ':'等于','nequ':'不等于'};
        }
        case 'time':{
          return {'equ':'等于','nequ':'不等于','gre':'大于','greq':'大于等于','les':'小于','lesq':'小于等于'};
        }
        case 'date':{
          return {'equ':'等于','nequ':'不等于','gre':'大于','greq':'大于等于','les':'小于','lesq':'小于等于'};
        }
        case 'datetime':{
          return {'equ':'等于','nequ':'不等于','gre':'大于','greq':'大于等于','les':'小于','lesq':'小于等于'};
        }
        case 'percent':{
          return {'equ':'等于','nequ':'不等于','gre':'大于','greq':'大于等于','les':'小于','lesq':'小于等于'};
        }
        case 'number':{
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
        case 'list':{
          return {'equ':'等于','nequ':'不等于'};
        }
        case 'bool':{
          return {'equ':'等于','nequ':'不等于'};
        }
        case 'time':{
          return {'equ':'等于','nequ':'不等于','gre':'大于','greq':'大于等于','les':'小于','lesq':'小于等于'};
        }
        case 'date':{
          return {'equ':'等于','nequ':'不等于','gre':'大于','greq':'大于等于','les':'小于','lesq':'小于等于'};
        }
        case 'datetime':{
          return {'equ':'等于','nequ':'不等于','gre':'大于','greq':'大于等于','les':'小于','lesq':'小于等于'};
        }
        case 'percent':{
          return {'equ':'等于','nequ':'不等于','gre':'大于','greq':'大于等于','les':'小于','lesq':'小于等于'};
        }
        case 'number':{
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
    cEditTemplate(){
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
        let ID;
        do{ID=this.createTemplateId();}
        while(Object.prototype.hasOwnProperty.call(this.$store.state.templateData,ID));
        let Empty={//空模板对象
          id:ID,
          name:'',
          creator:'',
          modify:'',
          locked:false,
          explain:'none',
          typeRule:{point:true, line:true, area:true, curve:true},
          detailsRule:[{set:false, name:'name', default:'☍tunknown', type:'text'}],
          colorRule:{basis:'', type:'', condition:[]},
          widthRule:{basis:'', type:'', condition:[]}
        };
        this.templateShow=true;
        if(this.cEditTemplate!==null){//传入模板不为空
          if(this.tmpProof.tpCheck(this.cEditTemplate)){//传入模板通过检查
            this.editTemplate=JSON.parse(JSON.stringify(this.cEditTemplate));//拷贝源数据避免模板编辑影响源
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
.basisCo2{
  user-select:none;
  width: auto;
  position: absolute;
  background: white;
  box-shadow: 0px 0px 6px #c2c2c2;
  border-radius: 4px;
}
.basisCo3{
  cursor: default;
  width: auto;
  height: 26px;
  padding: 2px 15px;
  font-size: 14px;
  background: #ffffff;
  border-radius: 0px;
  position: relative;
  right: 0px;
  top: 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.basisCo3:hover{
  background: #f7f7f7;
}
.rowTextOut{
  width: inherit;
  height: inherit;
  display: inherit;
  flex-direction: inherit;
  flex-wrap: inherit;
  justify-content: inherit;
  align-items: inherit;

}
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
  width: calc(58% - 30px);
  min-width: 780px;
  height: 70%;
  min-height: 540px;
  background: #ffffff;
  position: fixed;
  z-index: 558;
  top: 14%;
  left: 21%;
  padding: 0px 15px;
  border-radius: 5px;
}
.RowTitle{
  font-size: 17px;
  color: #466fe7;
  user-select: none;
  cursor: default;
  border: none!important;
}
.RowText{
  font-size: 14px;
  color: #000000;
  border-top: 1px solid #a5a5a5;
  border-left: 1px solid #a5a5a5;
  border-right: 1px solid #a5a5a5;
}
.lastRow{
  border-bottom: 1px solid #a5a5a5;
  border-left: 1px solid #a5a5a5;
  border-right: 1px solid #a5a5a5;
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
  box-sizing: content-box;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  font-size: 16px;
  padding: 0px 0px 2px 0px;
  height:auto;
  border: none;
  color: #000;
  font-weight: 400;
  -webkit-appearance: none;
  outline: none;
}
.statusInput:hover{
  cursor: text;
  background: #fafafa;
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
.SheetCo10{
  width: 9%;
  height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.SheetCo0{
  width: 3%;
  height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.SheetCo1{
  width: 31%;
  height: 40px;
  display: flex;
  justify-content: start;
  align-items: center;
}
.SheetCo2{
  width:40%;
  height: 40px;
  display: flex;
  justify-content: start;
  align-items: center;
}
.pickCo3{/*used*/
  background: #e6e6e6;
}
.pickCo3:hover{/*used*/
  background:#e6e6e6;
}
.itemCo3{
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: default;
}
.itemCo3:hover{
  background: #f7f7f7;
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
  width: 50%;
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
  height: 50px;
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
.lisCo9{
  width: 15px;
  height: 15px;
  margin:3px;
}
.SheetRow{
  width: 100%;
  height: 60px;
  margin: 0px 0px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: center;
}
.SheetRow:last-child{
  margin-top:10px;
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
  width: calc(100% - 10px);
  height: auto;
  padding: 10px 0px 10px 0px;
  margin-right: 10px;
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
  padding: 20px 0px;
  height: auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.ListLeft{
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  width: 180px;
  height: 100%;
}
.ListRightText{
  width: calc(100%);
}
.ListRight{
  width: calc(100% - 180px);
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  overflow-x: hidden;
  overflow-y: auto;
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
  font-size: 16px;
  text-align: start;
  margin: 20px;
  text-indent: 32px;
}
.textH3{
  font-weight: 600;
  font-size: 19px;
  text-align: start;
  margin: 10px;
}
.textH4{
  color: #ff4f4f;
  font-weight: 600;
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
  background: #ffffff;
  box-shadow: 0px 0px 6px #e6e6e6;
  user-select: none;
}
.templateRight{
  width: calc(100% - 180px - 20px);
  height: 100%;
  padding: 0px 0px 0px 20px;
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
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  height: 50px;
  font-size: 16px;
  font-weight: 400;
  margin: 20px 10px;
}
.templateSel span{
  width: calc(100% - 5px);
  height: 50px;
  padding-left: 5px;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  cursor: pointer;
  transition: 0.4s !important;
}
.templateSel span:hover{
  background: #d7e3ff !important;;
  color: #0b45d4 !important;;
}
.nifty{
  box-shadow: 1px 1px 10px #ececec;
  animation: niftyEd 0.4s forwards;
}
.unNifty{
  background: #ffffff;
  color: #717171;
}
@keyframes niftyEd {
  from{
    background: #ffffff;
    color: #717171;
  }
  to{
    transform: scale(1.2);
    background: #d7e3ff;
    color: #0b45d4;
  }
}
.diagram{
  box-shadow: 0px 0px 3px #d9d9d9;
}
</style>
