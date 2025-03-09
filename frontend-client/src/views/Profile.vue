# 创建新的Profile.vue文件
<template>
  <div class="profile-container">
    <!-- 基本信息卡片 -->
    <el-card class="profile-card">
      <template #header>
        <div class="profile-header">
          <h2>基本信息</h2>
          <div class="header-actions">
            <el-button type="primary" @click="isEditing = !isEditing">
              {{ isEditing ? '保存' : '编辑' }}
            </el-button>
          </div>
        </div>
      </template>

      <el-form
        ref="profileFormRef"
        :model="profileForm"
        :rules="rules"
        label-width="100px"
        :disabled="!isEditing"
      >
        <el-form-item label="头像" prop="avatar">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :http-request="handleAvatarUpload"
          >
            <img v-if="profileForm.avatar" :src="profileForm.avatar" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item label="用户名" prop="username">
          <el-input v-model="profileForm.username" />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="profileForm.email" />
        </el-form-item>

        <el-form-item label="角色">
          <el-tag>{{ profileForm.role === 'admin' ? '管理员' : '学生' }}</el-tag>
        </el-form-item>

        <el-form-item label="注册时间">
          <span>{{ formatDate(profileForm.createdAt) }}</span>
        </el-form-item>

        <el-form-item>
          <el-button type="warning" @click="showPasswordDialog = true">
            修改密码
          </el-button>
        </el-form-item>

        <el-form-item v-if="isEditing">
          <el-button type="primary" @click="handleSubmit">保存修改</el-button>
          <el-button @click="cancelEdit">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 修改密码对话框 -->
    <el-dialog
      v-model="showPasswordDialog"
      title="修改密码"
      width="500px"
      destroy-on-close
      class="password-dialog"
    >
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="100px"
        status-icon
      >
        <el-form-item label="当前密码" prop="currentPassword">
          <el-input
            v-model="passwordForm.currentPassword"
            type="password"
            placeholder="请输入当前密码"
            show-password
            :maxlength="20"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="新密码" prop="newPassword">
          <div class="password-input-wrapper">
            <el-input
              v-model="passwordForm.newPassword"
              type="password"
              placeholder="请输入新密码"
              show-password
              :maxlength="20"
              @focus="showPasswordRules = true"
              @blur="handlePasswordBlur"
            >
              <template #prefix>
                <el-icon><Key /></el-icon>
              </template>
              <template #suffix>
                <div class="password-strength-indicator">
                  <div 
                    class="strength-bar" 
                    :class="[
                      passwordStrengthLevel > 0 ? 'active' : '',
                      `level-${passwordStrengthLevel}`
                    ]"
                  ></div>
                  <el-tooltip
                    placement="top"
                    :show-after="200"
                    :hide-after="200"
                    popper-class="password-rules-tooltip"
                  >
                    <template #content>
                      <div class="password-rules">
                        <div class="rules-grid">
                          <div 
                            class="rule-item" 
                            :class="{ 'rule-met': hasUpperCase }"
                          >
                            <el-icon :class="{ 'rule-met': hasUpperCase }">
                              <component :is="hasUpperCase ? 'CircleCheckFilled' : 'CircleCloseFilled'" />
                            </el-icon>
                            <span>大写字母</span>
                          </div>
                          <div 
                            class="rule-item" 
                            :class="{ 'rule-met': hasLowerCase }"
                          >
                            <el-icon :class="{ 'rule-met': hasLowerCase }">
                              <component :is="hasLowerCase ? 'CircleCheckFilled' : 'CircleCloseFilled'" />
                            </el-icon>
                            <span>小写字母</span>
                          </div>
                          <div 
                            class="rule-item" 
                            :class="{ 'rule-met': hasNumber }"
                          >
                            <el-icon :class="{ 'rule-met': hasNumber }">
                              <component :is="hasNumber ? 'CircleCheckFilled' : 'CircleCloseFilled'" />
                            </el-icon>
                            <span>数字</span>
                          </div>
                          <div 
                            class="rule-item" 
                            :class="{ 'rule-met': hasSpecialChar }"
                          >
                            <el-icon :class="{ 'rule-met': hasSpecialChar }">
                              <component :is="hasSpecialChar ? 'CircleCheckFilled' : 'CircleCloseFilled'" />
                            </el-icon>
                            <span>特殊字符</span>
                          </div>
                          <div 
                            class="rule-item" 
                            :class="{ 'rule-met': isLengthValid }"
                          >
                            <el-icon :class="{ 'rule-met': isLengthValid }">
                              <component :is="isLengthValid ? 'CircleCheckFilled' : 'CircleCloseFilled'" />
                            </el-icon>
                            <span>至少6位</span>
                          </div>
                        </div>
                      </div>
                    </template>
                    <el-icon 
                      class="password-rules-icon"
                      :class="{ 'rules-met': allRulesMet }"
                    >
                      <InfoFilled />
                    </el-icon>
                  </el-tooltip>
                </div>
              </template>
            </el-input>
          </div>
        </el-form-item>

        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            show-password
            :maxlength="20"
          >
            <template #prefix>
              <el-icon><Check /></el-icon>
            </template>
          </el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showPasswordDialog = false">取消</el-button>
          <el-button type="primary" @click="handlePasswordSubmit" :loading="isSubmitting">
            确认修改
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 简历上传卡片 -->
    <el-card class="profile-card">
      <template #header>
        <div class="profile-header">
          <h2>简历上传</h2>
          <div class="upload-actions">
            <el-button type="primary" @click="startOnlineEdit">在线编辑</el-button>
            <el-button type="success" @click="importFromLinkedIn">从LinkedIn导入</el-button>
          </div>
        </div>
      </template>

      <div class="resume-upload">
        <el-tabs v-model="activeUploadTab">
          <el-tab-pane label="本地上传" name="local">
            <el-upload
              class="resume-uploader"
              :action="uploadUrl"
              :before-upload="beforeResumeUpload"
              :on-success="handleResumeSuccess"
              :on-error="handleResumeError"
              :show-file-list="true"
              :limit="5"
              accept=".pdf,.doc,.docx"
              drag
            >
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">
                拖拽文件到此处或 <em>点击上传</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  支持PDF、Word格式，单个文件不超过10MB，最多上传5份简历
                </div>
              </template>
            </el-upload>
          </el-tab-pane>
          
          <el-tab-pane label="URL导入" name="url">
            <div class="url-import">
              <el-input
                v-model="resumeUrl"
                placeholder="请输入简历URL地址"
                clearable
              >
                <template #append>
                  <el-button @click="importFromUrl">导入</el-button>
                </template>
              </el-input>
              <div class="url-tip">支持主流求职网站的简历链接</div>
            </div>
          </el-tab-pane>
        </el-tabs>

        <div v-if="resumeList.length > 0" class="resume-list">
          <h3>已上传简历：</h3>
          <el-table :data="resumeList" style="width: 100%">
            <el-table-column prop="name" label="文件名" />
            <el-table-column prop="type" label="类型" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.type === 'pdf' ? 'danger' : 'primary'">
                  {{ scope.row.type.toUpperCase() }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="uploadTime" label="上传时间" width="180" />
            <el-table-column label="操作" width="200">
              <template #default="scope">
                <el-button type="primary" link @click="previewResume(scope.row)">
                  预览
                </el-button>
                <el-button type="success" link @click="setDefaultResume(scope.row)">
                  设为默认
                </el-button>
                <el-button type="danger" link @click="removeResume(scope.row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>

    <!-- 附加信息卡片 -->
    <el-card class="profile-card">
      <template #header>
        <div class="profile-header">
          <h2>附加信息</h2>
          <el-button type="primary" @click="isEditingExtra = !isEditingExtra">
            {{ isEditingExtra ? '保存' : '编辑' }}
          </el-button>
        </div>
      </template>

      <el-form :disabled="!isEditingExtra">
        <!-- 职业偏好 -->
        <div class="section-header">
          <h3>职业偏好</h3>
        </div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="职业方向">
              <el-select
                v-model="extraInfo.careerPreference.direction"
                multiple
                filterable
                placeholder="请选择职业发展方向"
              >
                <el-option label="技术专家" value="tech_expert" />
                <el-option label="管理岗位" value="management" />
                <el-option label="产品设计" value="product" />
                <el-option label="技术咨询" value="consultant" />
                <el-option label="创业" value="startup" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="行业偏好">
              <el-select
                v-model="extraInfo.careerPreference.industry"
                multiple
                filterable
                placeholder="请选择期望行业"
              >
                <el-option label="互联网" value="internet" />
                <el-option label="金融科技" value="fintech" />
                <el-option label="人工智能" value="ai" />
                <el-option label="企业服务" value="enterprise" />
                <el-option label="教育科技" value="edutech" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 工作条件需求 -->
        <div class="section-header">
          <h3>工作条件需求</h3>
        </div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="工作制度">
              <el-select
                v-model="extraInfo.workConditions.schedule"
                multiple
                placeholder="请选择工作制度"
              >
                <el-option label="弹性工作" value="flexible" />
                <el-option label="标准工时" value="standard" />
                <el-option label="混合办公" value="hybrid" />
                <el-option label="远程工作" value="remote" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="加班情况">
              <el-radio-group v-model="extraInfo.workConditions.overtime">
                <el-radio label="never">不接受加班</el-radio>
                <el-radio label="moderate">适度加班</el-radio>
                <el-radio label="flexible">视情况而定</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="福利期望">
          <el-checkbox-group v-model="extraInfo.workConditions.benefits">
            <el-checkbox label="insurance">五险一金</el-checkbox>
            <el-checkbox label="bonus">年终奖金</el-checkbox>
            <el-checkbox label="stock">股票期权</el-checkbox>
            <el-checkbox label="training">培训发展</el-checkbox>
            <el-checkbox label="vacation">带薪休假</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <!-- 职业发展需求 -->
        <div class="section-header">
          <h3>职业发展需求</h3>
        </div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="发展目标">
              <el-select
                v-model="extraInfo.careerDevelopment.goals"
                multiple
                placeholder="请选择职业发展目标"
              >
                <el-option label="技术深造" value="tech_improvement" />
                <el-option label="管理晋升" value="management_promotion" />
                <el-option label="创新创业" value="innovation" />
                <el-option label="跨领域发展" value="cross_domain" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="培训需求">
              <el-select
                v-model="extraInfo.careerDevelopment.training"
                multiple
                placeholder="请选择培训需求"
              >
                <el-option label="技术认证" value="certification" />
                <el-option label="管理能力" value="management_skills" />
                <el-option label="软技能提升" value="soft_skills" />
                <el-option label="领导力培养" value="leadership" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 技能熟练度分级 -->
        <div class="section-header">
          <h3>技能熟练度分级</h3>
          <div class="skill-actions">
            <el-button type="primary" @click="showSkillDialog = true">
              <el-icon><Plus /></el-icon>添加技能
            </el-button>
            <el-button type="success" @click="importSkills">
              <el-icon><Upload /></el-icon>导入技能
            </el-button>
          </div>
        </div>

        <div class="skill-container">
          <!-- 技能分类标签页 -->
          <el-tabs v-model="activeSkillTab" class="skill-tabs" @tab-click="handleSkillTabClick">
            <el-tab-pane 
              v-for="category in displayedCategories" 
              :key="category.id" 
              :label="category.name" 
              :name="category.id"
            >
              <!-- 技能列表 -->
              <div class="skill-list">
                <el-row :gutter="20">
                  <el-col 
                    v-for="skill in category.skills" 
                    :key="skill.id" 
                    :xs="24" 
                    :sm="12" 
                    :md="8" 
                    :lg="6"
                  >
                    <el-card class="skill-card" :body-style="{ padding: '10px' }">
                      <div class="skill-card-header">
                        <el-tag :type="getSkillTypeColor(skill.level)">{{ getSkillLevelText(skill.level) }}</el-tag>
                        <el-dropdown trigger="click" @command="handleSkillCommand($event, skill)">
                          <el-icon class="skill-more"><More /></el-icon>
                          <template #dropdown>
                            <el-dropdown-menu>
                              <el-dropdown-item command="edit">编辑</el-dropdown-item>
                              <el-dropdown-item command="delete" divided danger>删除</el-dropdown-item>
                            </el-dropdown-menu>
                          </template>
                        </el-dropdown>
                      </div>
                      <h4 class="skill-name">{{ skill.name }}</h4>
                      <div class="skill-info">
                        <el-tag size="small" :type="getSkillLevelColor(skill.level)">
                          {{ getSkillLevelText(skill.level) }}
                        </el-tag>
                        <span class="skill-years">{{ skill.years }}年经验</span>
                      </div>
                      <div class="skill-progress">
                        <el-progress 
                          :percentage="skill.level * 20" 
                          :color="getSkillProgressColor(skill.level)"
                        />
                      </div>
                      <p class="skill-description">{{ skill.description }}</p>
                    </el-card>
                  </el-col>
                </el-row>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>

        <!-- 添加/编辑技能对话框 -->
        <el-dialog 
          v-model="showSkillDialog" 
          :title="editingSkill ? '编辑技能' : '添加技能'"
          width="500px"
        >
          <el-form 
            ref="skillFormRef"
            :model="skillForm"
            :rules="skillRules"
            label-width="100px"
          >
            <el-form-item label="所属学科" prop="categoryId">
              <el-select 
                v-model="skillForm.categoryId" 
                placeholder="请选择所属学科"
              >
                <el-option
                  v-for="field in academicFields"
                  :key="field.id"
                  :label="field.name"
                  :value="field.id"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="技能名称" prop="name">
              <el-input v-model="skillForm.name" placeholder="请输入技能名称" />
            </el-form-item>

            <el-form-item label="熟练度" prop="level">
              <el-rate
                v-model="skillForm.level"
                :max="5"
                :colors="skillLevelColors"
                :texts="skillLevelTexts"
                show-text
              />
            </el-form-item>

            <el-form-item label="使用年限" prop="years">
              <el-input-number 
                v-model="skillForm.years" 
                :min="0" 
                :max="20" 
                :step="0.5"
                placeholder="请输入使用年限"
              />
            </el-form-item>

            <el-form-item label="技能描述" prop="description">
              <el-input
                v-model="skillForm.description"
                type="textarea"
                :rows="3"
                placeholder="请简要描述您的技能水平和应用场景"
              />
            </el-form-item>
          </el-form>

          <template #footer>
            <span class="dialog-footer">
              <el-button @click="showSkillDialog = false">取消</el-button>
              <el-button type="primary" @click="submitSkill">确定</el-button>
            </span>
          </template>
        </el-dialog>

        <!-- 个人特质与能力 -->
        <div class="traits-section">
          <div class="section-header">
            <div class="header-content">
              <h3>个人特质与能力</h3>
            </div>
          </div>
          
          <el-form :disabled="!isEditingExtra" class="traits-form">
            <!-- 核心能力 -->
            <div class="trait-card">
              <div class="trait-card-header">
                <h4>核心能力</h4>
                <el-tooltip content="展示您的专业技能和语言能力" placement="top">
                  <el-icon><InfoFilled /></el-icon>
                </el-tooltip>
              </div>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="专业技能" class="trait-form-item">
                    <el-select
                      v-model="extraInfo.personalTraits.coreAbilities"
                      multiple
                      filterable
                      allow-create
                      default-first-option
                      placeholder="请选择或输入专业技能"
                      class="trait-select"
                    >
                      <el-option
                        v-for="ability in coreAbilityOptions"
                        :key="ability.value"
                        :label="ability.label"
                        :value="ability.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="语言能力" class="trait-form-item">
                    <el-select
                      v-model="extraInfo.personalTraits.languages"
                      multiple
                      filterable
                      placeholder="请选择语言能力"
                      class="trait-select"
                    >
                      <el-option
                        v-for="lang in languageOptions"
                        :key="lang.value"
                        :label="lang.label"
                        :value="lang.value"
                      >
                        <div class="language-option">
                          <span>{{ lang.label }}</span>
                          <el-tag size="small" type="info">{{ lang.level }}</el-tag>
                        </div>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

            <!-- 性格特征 -->
            <div class="trait-card">
              <div class="trait-card-header">
                <h4>性格特征</h4>
                <el-tooltip content="描述您的性格类型和工作风格" placement="top">
                  <el-icon><InfoFilled /></el-icon>
                </el-tooltip>
              </div>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="MBTI类型" class="trait-form-item">
                    <el-select
                      v-model="extraInfo.personalTraits.mbtiType"
                      placeholder="请选择MBTI类型"
                      class="trait-select"
                      @change="handleMbtiChange"
                    >
                      <el-option-group
                        v-for="group in mbtiOptions"
                        :key="group.label"
                        :label="group.label"
                      >
                        <el-option
                          v-for="item in group.options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                          <div class="mbti-option">
                            <span>{{ item.label }}</span>
                            <span class="mbti-description">{{ item.description }}</span>
                          </div>
                        </el-option>
                      </el-option-group>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="工作风格" class="trait-form-item">
                    <el-select
                      v-model="extraInfo.personalTraits.workingStyle"
                      multiple
                      placeholder="请选择工作风格"
                      class="trait-select"
                    >
                      <el-option
                        v-for="style in workingStyleOptions"
                        :key="style.value"
                        :label="style.label"
                        :value="style.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

            <!-- 软实力评估 -->
            <div class="trait-card">
              <div class="trait-card-header">
                <h4>软实力评估</h4>
                <el-tooltip content="评估您的综合能力水平" placement="top">
                  <el-icon><InfoFilled /></el-icon>
                </el-tooltip>
              </div>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="沟通能力" class="trait-form-item">
                    <el-rate
                      v-model="extraInfo.personalTraits.communicationLevel"
                      :max="5"
                      :texts="communicationLevelTexts"
                      show-text
                      class="trait-rate"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="团队协作" class="trait-form-item">
                    <el-rate
                      v-model="extraInfo.personalTraits.teamworkLevel"
                      :max="5"
                      :texts="teamworkLevelTexts"
                      show-text
                      class="trait-rate"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="领导能力" class="trait-form-item">
                    <el-rate
                      v-model="extraInfo.personalTraits.leadershipLevel"
                      :max="5"
                      :texts="leadershipLevelTexts"
                      show-text
                      class="trait-rate"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="问题解决" class="trait-form-item">
                    <el-rate
                      v-model="extraInfo.personalTraits.problemSolvingLevel"
                      :max="5"
                      :texts="problemSolvingLevelTexts"
                      show-text
                      class="trait-rate"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

            <!-- 证书认证 -->
            <div class="trait-card">
              <div class="trait-card-header">
                <h4>证书认证</h4>
                <div class="trait-card-actions">
                  <el-tooltip content="添加您的专业证书" placement="top">
                    <el-icon><InfoFilled /></el-icon>
                  </el-tooltip>
                  <el-button 
                    type="primary" 
                    link 
                    :disabled="!isEditingExtra"
                    @click="showAddCertificateDialog = true"
                  >
                    <el-icon><Plus /></el-icon>添加证书
                  </el-button>
                </div>
              </div>
              <el-table 
                :data="extraInfo.personalTraits.certificates" 
                style="width: 100%"
                :class="{ 'disabled-table': !isEditingExtra }"
              >
                <el-table-column prop="name" label="证书名称" />
                <el-table-column prop="issuer" label="发证机构" />
                <el-table-column prop="date" label="获得日期" width="180" />
                <el-table-column prop="expiry" label="有效期" width="180" />
                <el-table-column fixed="right" label="操作" width="120" v-if="isEditingExtra">
                  <template #default="scope">
                    <el-button link type="primary" @click="editCertificate(scope.row)">编辑</el-button>
                    <el-button link type="danger" @click="removeCertificate(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form>
        </div>

        <!-- 保存按钮 -->
        <div class="traits-actions" v-if="isEditingExtra">
          <el-button type="primary" @click="handleSubmit">保存修改</el-button>
          <el-button @click="cancelEdit">取消</el-button>
        </div>
      </el-form>
    </el-card>

    <!-- 证书添加/编辑对话框 -->
    <el-dialog
      v-model="showAddCertificateDialog"
      :title="editingCertificate ? '编辑证书' : '添加证书'"
      width="500px"
    >
      <el-form
        ref="certificateFormRef"
        :model="certificateForm"
        :rules="certificateRules"
        label-width="100px"
      >
        <el-form-item label="证书名称" prop="name">
          <el-input 
            v-model="certificateForm.name" 
            placeholder="请输入证书名称"
            :maxlength="50"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="发证机构" prop="issuer">
          <el-input 
            v-model="certificateForm.issuer" 
            placeholder="请输入发证机构名称"
            :maxlength="50"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="获得日期" prop="date">
          <el-date-picker
            v-model="certificateForm.date"
            type="date"
            placeholder="选择获得日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :disabled-date="disableFutureDate"
          />
        </el-form-item>

        <el-form-item label="有效期至" prop="expiry">
          <el-date-picker
            v-model="certificateForm.expiry"
            type="date"
            placeholder="选择有效期（可选）"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :disabled-date="disablePastDate"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelCertificate">取消</el-button>
          <el-button type="primary" @click="submitCertificate">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Document, UploadFilled, More, Upload, InfoFilled, Lock, Key, Check } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router'

// 用户信息表单
const isEditing = ref(false)
const profileFormRef = ref<FormInstance>()
const userStore = useUserStore()
const router = useRouter()

const profileForm = reactive({
  username: '',
  email: '',
  avatar: '',
  role: '',
  createdAt: '',
  updatedAt: ''
})

// 表单验证规则
const rules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
})

// 简历上传相关
const uploadUrl = `${import.meta.env.VITE_API_URL}/api/resume/upload`
const activeUploadTab = ref('local')
const resumeUrl = ref('')
const resumeList = ref<Array<{
  id: string
  name: string
  type: string
  url: string
  uploadTime: string
  isDefault: boolean
}>>([])

const beforeResumeUpload = (file: File) => {
  const isValidType = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)
  const isLt10M = file.size / 1024 / 1024 < 10

  if (!isValidType) {
    ElMessage.error('只能上传PDF或Word格式的文件!')
    return false
  }
  if (!isLt10M) {
    ElMessage.error('文件大小不能超过 10MB!')
    return false
  }
  return true
}

const handleResumeSuccess = (response: any, file: any) => {
  resumeList.value.push({
    id: response.fileId,
    name: file.name,
    type: file.name.split('.').pop() || '',
    url: response.fileUrl,
    uploadTime: new Date().toLocaleString(),
    isDefault: resumeList.value.length === 0
  })
  ElMessage.success('简历上传成功')
}

const handleResumeError = () => {
  ElMessage.error('文件上传失败，请重试')
}

const removeResume = (resume: any) => {
  const index = resumeList.value.findIndex(item => item.id === resume.id)
  if (index !== -1) {
    resumeList.value.splice(index, 1)
    ElMessage.success('简历删除成功')
  }
}

const previewResume = (resume: any) => {
  window.open(resume.url, '_blank')
}

const setDefaultResume = (resume: any) => {
  resumeList.value.forEach(item => {
    item.isDefault = item.id === resume.id
  })
  ElMessage.success('默认简历设置成功')
}

const startOnlineEdit = () => {
  router.push('/resume/edit')
}

const importFromLinkedIn = () => {
  ElMessage.info('LinkedIn导入功能即将上线')
}

const importFromUrl = () => {
  if (!resumeUrl.value) {
    ElMessage.warning('请输入简历URL')
    return
  }
  // 这里添加URL导入逻辑
  ElMessage.info('URL导入功能即将上线')
  resumeUrl.value = ''
}

// 附加信息表单
const isEditingExtra = ref(false)

// 在extraInfo定义之前添加类型
interface ExtraInfo {
  careerPreference: {
    direction: string[]
    industry: string[]
  }
  workConditions: {
    schedule: string[]
    overtime: string
    benefits: string[]
  }
  careerDevelopment: {
    goals: string[]
    training: string[]
  }
  skillCategories: SkillCategory[]
  personalTraits: PersonalTraits
}

// 修改extraInfo的类型声明
const extraInfo = reactive<ExtraInfo>({
  careerPreference: {
    direction: [],
    industry: []
  },
  workConditions: {
    schedule: [],
    overtime: '',
    benefits: []
  },
  careerDevelopment: {
    goals: [],
    training: []
  },
  skillCategories: [],
  personalTraits: {
    coreAbilities: [],
    languages: [],
    mbtiType: '',
    workingStyle: [],
    communicationLevel: 3,
    teamworkLevel: 3,
    leadershipLevel: 3,
    problemSolvingLevel: 3,
    certificates: []
  }
})

// 选项数据
const positionOptions = [
  '软件工程师',
  '前端开发',
  '后端开发',
  '全栈开发',
  'DevOps工程师',
  '测试工程师',
  '产品经理',
  '项目经理'
]

const skillOptions = [
  'JavaScript',
  'TypeScript',
  'Vue',
  'React',
  'Node.js',
  'Python',
  'Java',
  'C++',
  'Docker',
  'Kubernetes'
]

const certificateOptions = [
  'AWS认证',
  'PMP认证',
  'CCNA认证',
  'Linux认证',
  'Oracle认证'
]

// 方法定义
const formatDate = (date: string) => {
  return new Date(date).toLocaleString()
}

const beforeAvatarUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('上传头像图片只能是图片格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!')
    return false
  }
  return true
}

const handleAvatarUpload = async ({ file }: { file: File }) => {
  // 这里应该调用实际的上传API
  profileForm.avatar = URL.createObjectURL(file)
  ElMessage.success('头像上传成功')
}

const handleSubmit = async () => {
  if (!profileFormRef.value) return

  await profileFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await userStore.updateUserInfo({
          username: profileForm.username,
          email: profileForm.email,
          avatar: profileForm.avatar
        })
        isEditing.value = false
        ElMessage.success('个人信息更新成功')
      } catch (error) {
        ElMessage.error('更新失败')
      }
    }
  })
}

const cancelEdit = () => {
  getUserInfo()
  isEditing.value = false
}

const getUserInfo = () => {
  if (userStore.userInfo) {
    Object.assign(profileForm, {
      username: userStore.userInfo.username,
      email: userStore.userInfo.email,
      avatar: userStore.userInfo.avatar,
      role: userStore.userInfo.role,
      createdAt: userStore.userInfo.createdAt,
      updatedAt: userStore.userInfo.updatedAt
    })
  }
}

// MBTI测评
const startMBTITest = () => {
  router.push('/assessment/mbti')
}

// 技能相关类型定义
interface Skill {
  id: string
  name: string
  level: number
  years: number
  description: string
  categoryId: string
}

interface SkillCategory {
  id: string
  name: string
  skills: Skill[]
}

// 预设的学科分类数据
const academicFields = [
  {
    id: 'philosophy',
    name: '哲学',
    description: '研究人类思维、认知和价值观的学科'
  },
  {
    id: 'economics',
    name: '经济学',
    description: '研究资源配置和经济活动的学科'
  },
  {
    id: 'law',
    name: '法学',
    description: '研究法律规范和司法制度的学科'
  },
  {
    id: 'education',
    name: '教育学',
    description: '研究教育理论和实践的学科'
  },
  {
    id: 'literature',
    name: '文学',
    description: '研究语言文字和文学创作的学科'
  },
  {
    id: 'history',
    name: '历史学',
    description: '研究人类社会发展历程的学科'
  },
  {
    id: 'science',
    name: '理学',
    description: '研究自然现象和规律的基础学科'
  },
  {
    id: 'engineering',
    name: '工学',
    description: '研究工程技术和应用科学的学科'
  },
  {
    id: 'agriculture',
    name: '农学',
    description: '研究农业生产和发展的学科'
  },
  {
    id: 'medicine',
    name: '医学',
    description: '研究人体健康和疾病的学科'
  },
  {
    id: 'management',
    name: '管理学',
    description: '研究组织管理和决策的学科'
  },
  {
    id: 'military',
    name: '军事学',
    description: '研究军事理论和实践的学科'
  },
  {
    id: 'art',
    name: '艺术学',
    description: '研究艺术创作和审美的学科'
  },
  {
    id: 'interdisciplinary',
    name: '交叉学科',
    description: '跨越多个学科领域的综合研究'
  }
]

// 技能表单引用和状态
const showSkillDialog = ref(false)
const editingSkill = ref<Skill | null>(null)
const activeSkillTab = ref('')
const skillFormRef = ref<FormInstance>()

// 技能表单数据
const skillForm = reactive<Omit<Skill, 'id'>>({
  name: '',
  categoryId: '',
  level: 3,
  years: 1,
  description: ''
})

// 技能表单验证规则
const skillRules = {
  name: [{ required: true, message: '请输入技能名称', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择所属学科', trigger: 'change' }],
  level: [{ required: true, message: '请选择熟练度', trigger: 'change' }],
  years: [{ required: true, message: '请输入使用年限', trigger: 'blur' }]
}

// 技能类型选项
const skillLevelColors = ['#909399', '#67C23A', '#E6A23C', '#F56C6C', '#409EFF']
const skillLevelTexts = ['入门', '熟悉', '掌握', '精通', '专家']

// 获取技能类型对应的颜色
const getSkillTypeColor = (level: number): string => {
  const colors = ['info', 'success', 'warning', 'danger', 'primary']
  return colors[level - 1] || 'info'
}

// 获取技能等级对应的颜色
const getSkillLevelColor = (level: number): string => {
  const colors = ['info', 'success', 'warning', 'danger', 'primary']
  return colors[level - 1] || 'info'
}

// 获取技能等级对应的文本
const getSkillLevelText = (level: number): string => {
  return skillLevelTexts[level - 1] || '入门'
}

// 获取进度条颜色
const getSkillProgressColor = (level: number): string => {
  return skillLevelColors[level - 1] || '#909399'
}

// 处理标签页切换
const handleSkillTabClick = () => {
  // 可以在这里添加标签页切换时的逻辑
}

// 处理技能卡片的操作
const handleSkillCommand = async (command: 'edit' | 'delete', skill: Skill) => {
  if (command === 'edit') {
    editingSkill.value = skill
    Object.assign(skillForm, {
      name: skill.name,
      categoryId: skill.categoryId,
      level: skill.level,
      years: skill.years,
      description: skill.description
    })
    showSkillDialog.value = true
  } else if (command === 'delete') {
    try {
      await ElMessageBox.confirm('确定要删除该技能吗？', '提示', {
        type: 'warning'
      })
      const category = extraInfo.skillCategories.find(c => c.id === skill.categoryId)
      if (category) {
        const index = category.skills.findIndex(s => s.id === skill.id)
        if (index !== -1) {
          category.skills.splice(index, 1)
          ElMessage.success('技能删除成功')
        }
      }
    } catch {
      // 用户取消删除操作
    }
  }
}

// 提交技能表单
const submitSkill = async () => {
  if (!skillFormRef.value) return
  
  try {
    await skillFormRef.value.validate()
    const category = extraInfo.skillCategories.find(c => c.id === skillForm.categoryId)
    if (!category) {
      ElMessage.error('所选分类不存在')
      return
    }

    const skillData: Skill = {
      id: editingSkill.value?.id || Date.now().toString(),
      ...skillForm
    }

    if (editingSkill.value) {
      // 更新现有技能
      const index = category.skills.findIndex(s => s.id === skillData.id)
      if (index !== -1) {
        category.skills[index] = skillData
        ElMessage.success('技能更新成功')
      }
    } else {
      // 添加新技能
      category.skills.push(skillData)
      // 如果是该分类的第一个技能，自动切换到该分类标签
      if (category.skills.length === 1) {
        activeSkillTab.value = category.id
      }
      ElMessage.success('技能添加成功')
    }

    showSkillDialog.value = false
    resetSkillForm()
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 重置技能表单
const resetSkillForm = () => {
  skillForm.name = ''
  skillForm.categoryId = ''
  skillForm.level = 3
  skillForm.years = 1
  skillForm.description = ''
  editingSkill.value = null
}

// 导入技能
const importSkills = () => {
  // 这里可以实现从文件或其他平台导入技能的功能
  ElMessage.info('技能导入功能开发中')
}

// 添加显示分类的计算属性
const displayedCategories = computed(() => {
  return extraInfo.skillCategories.filter(category => category.skills.length > 0)
})

// 修改初始化方法
const initializeCategories = () => {
  if (extraInfo.skillCategories.length === 0) {
    extraInfo.skillCategories = academicFields.map(field => ({
      id: field.id,
      name: field.name,
      skills: []
    }))
    
    // 修改默认选中的分类逻辑
    const firstCategoryWithSkills = displayedCategories.value[0]
    activeSkillTab.value = firstCategoryWithSkills?.id || ''
  }
}

// 在组件挂载时初始化数据
onMounted(() => {
  getUserInfo()
  initializeCategories()
})

// 在script部分添加新的数据定义
// 核心能力选项
const coreAbilityOptions = [
  { label: '项目管理', value: 'project_management' },
  { label: '数据分析', value: 'data_analysis' },
  { label: '系统设计', value: 'system_design' },
  { label: '算法优化', value: 'algorithm_optimization' },
  { label: '架构设计', value: 'architecture_design' },
  { label: '团队管理', value: 'team_management' }
]

// MBTI选项
const mbtiOptions = [
  {
    label: '外向-内向',
    options: [
      { label: 'ENFJ', value: 'ENFJ', description: '教导者型' },
      { label: 'ENFP', value: 'ENFP', description: '激发者型' },
      { label: 'ENTJ', value: 'ENTJ', description: '统帅型' },
      { label: 'ENTP', value: 'ENTP', description: '发明家型' }
    ]
  },
  {
    label: '感知-直觉',
    options: [
      { label: 'INFJ', value: 'INFJ', description: '咨询师型' },
      { label: 'INFP', value: 'INFP', description: '治愈者型' },
      { label: 'INTJ', value: 'INTJ', description: '建筑师型' },
      { label: 'INTP', value: 'INTP', description: '逻辑学家型' }
    ]
  }
]

// 工作风格选项
const workingStyleOptions = [
  { label: '独立思考', value: 'independent_thinking' },
  { label: '团队协作', value: 'team_collaboration' },
  { label: '创新驱动', value: 'innovation_driven' },
  { label: '目标导向', value: 'goal_oriented' },
  { label: '细节关注', value: 'detail_oriented' }
]

// 软实力评分文本
const communicationLevelTexts = ['基础交流', '日常沟通', '清晰表达', '有效沟通', '卓越沟通']
const teamworkLevelTexts = ['基础配合', '积极参与', '良好协作', '团队促进', '卓越领导']
const leadershipLevelTexts = ['初步管理', '团队带领', '有效指导', '战略规划', '卓越领导']
const problemSolvingLevelTexts = ['问题识别', '方案制定', '有效解决', '系统思考', '创新突破']

// 证书表单相关
const showAddCertificateDialog = ref(false)
const editingCertificate = ref<Certificate | null>(null)
const certificateFormRef = ref()

const certificateForm = reactive({
  name: '',
  issuer: '',
  date: '',
  expiry: ''
})

// 证书表单验证规则
const certificateRules = {
  name: [
    { required: true, message: '请输入证书名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  issuer: [
    { required: true, message: '请输入发证机构', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  date: [
    { required: true, message: '请选择获得日期', trigger: 'change' },
    { 
      validator: (rule: any, value: string, callback: Function) => {
        if (value && certificateForm.expiry && value > certificateForm.expiry) {
          callback(new Error('获得日期不能晚于有效期'))
        } else {
          callback()
        }
      }, 
      trigger: 'change' 
    }
  ],
  expiry: [
    { 
      validator: (rule: any, value: string, callback: Function) => {
        if (value && certificateForm.date && value < certificateForm.date) {
          callback(new Error('有效期不能早于获得日期'))
        } else {
          callback()
        }
      }, 
      trigger: 'change' 
    }
  ]
}

// 禁用未来日期
const disableFutureDate = (time: Date) => {
  return time.getTime() > Date.now()
}

// 禁用过去日期
const disablePastDate = (time: Date) => {
  if (certificateForm.date) {
    const acquireDate = new Date(certificateForm.date)
    return time.getTime() < acquireDate.getTime()
  }
  return false
}

// 取消添加/编辑证书
const cancelCertificate = () => {
  showAddCertificateDialog.value = false
  resetCertificateForm()
}

// 提交证书表单
const submitCertificate = async () => {
  if (!certificateFormRef.value) return

  try {
    await certificateFormRef.value.validate()
    if (editingCertificate.value) {
      const index = extraInfo.personalTraits.certificates.findIndex(
        (cert: Certificate) => cert.name === editingCertificate.value?.name
      )
      if (index !== -1) {
        extraInfo.personalTraits.certificates[index] = { ...certificateForm }
      }
    } else {
      extraInfo.personalTraits.certificates.push({ ...certificateForm })
    }
    showAddCertificateDialog.value = false
    resetCertificateForm()
    ElMessage.success(
      editingCertificate.value ? '证书更新成功' : '证书添加成功'
    )
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 重置证书表单
const resetCertificateForm = () => {
  certificateForm.name = ''
  certificateForm.issuer = ''
  certificateForm.date = ''
  certificateForm.expiry = ''
  editingCertificate.value = null
}

// MBTI类型变更处理
const handleMbtiChange = (value: string) => {
  // 这里可以添加MBTI类型变更后的处理逻辑
  console.log('MBTI类型变更为:', value)
}

// 添加PersonalTraits接口定义
interface PersonalTraits {
  coreAbilities: string[]
  languages: string[]
  mbtiType: string
  workingStyle: string[]
  communicationLevel: number
  teamworkLevel: number
  leadershipLevel: number
  problemSolvingLevel: number
  certificates: Certificate[]
}

interface Certificate {
  name: string
  issuer: string
  date: string
  expiry: string
}

// 修改语言选项的类型定义
interface LanguageOption {
  label: string
  value: string
  level: string
}

// 使用新的类型定义
const languageOptions: LanguageOption[] = [
  { label: '英语', value: 'english', level: 'CET-6' },
  { label: '日语', value: 'japanese', level: 'N1' },
  { label: '德语', value: 'german', level: 'B2' },
  { label: '法语', value: 'french', level: 'B1' },
  { label: '韩语', value: 'korean', level: 'TOPIK 4级' }
]

// 证书相关方法
const editCertificate = (certificate: Certificate) => {
  editingCertificate.value = certificate
  Object.assign(certificateForm, certificate)
  showAddCertificateDialog.value = true
}

const removeCertificate = async (certificate: Certificate) => {
  try {
    await ElMessageBox.confirm('确定要删除该证书吗？', '提示', {
      type: 'warning'
    })
    const index = extraInfo.personalTraits.certificates.findIndex(
      cert => cert.name === certificate.name
    )
    if (index !== -1) {
      extraInfo.personalTraits.certificates.splice(index, 1)
      ElMessage.success('证书删除成功')
    }
  } catch {
    // 用户取消删除操作
  }
}

// 修改密码相关
const showPasswordDialog = ref(false)
const passwordFormRef = ref<FormInstance>()
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 密码校验相关
const isSubmitting = ref(false)

// 密码规则校验计算属性
const hasUpperCase = computed(() => /[A-Z]/.test(passwordForm.newPassword))
const hasLowerCase = computed(() => /[a-z]/.test(passwordForm.newPassword))
const hasNumber = computed(() => /\d/.test(passwordForm.newPassword))
const hasSpecialChar = computed(() => /[!@#$%^&*]/.test(passwordForm.newPassword))
const isLengthValid = computed(() => passwordForm.newPassword.length >= 6)

// 密码验证规则
const validatePass = (rule: any, value: string, callback: Function) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    const errors = []
    if (!isLengthValid.value) errors.push('密码长度不能小于6位')
    if (!hasUpperCase.value) errors.push('密码必须包含大写字母')
    if (!hasLowerCase.value) errors.push('密码必须包含小写字母')
    if (!hasNumber.value) errors.push('密码必须包含数字')
    if (!hasSpecialChar.value) errors.push('密码必须包含特殊字符(!@#$%^&*)')
    
    if (errors.length > 0) {
      callback(new Error(errors[0]))
    } else {
      if (passwordForm.confirmPassword !== '') {
        passwordFormRef.value?.validateField('confirmPassword')
      }
      callback()
    }
  }
}

const validateConfirmPass = (rule: any, value: string, callback: Function) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== passwordForm.newPassword) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const passwordRules = {
  currentPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, trigger: 'blur', validator: validatePass }
  ],
  confirmPassword: [
    { required: true, trigger: 'blur', validator: validateConfirmPass }
  ]
}

// 修改handlePasswordSubmit方法
const handlePasswordSubmit = async () => {
  if (!passwordFormRef.value) return
  
  try {
    await passwordFormRef.value.validate()
    isSubmitting.value = true
    
    const result = await userStore.updatePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword
    })
    
    if (result) {
      showPasswordDialog.value = false
      // 重置表单
      passwordForm.currentPassword = ''
      passwordForm.newPassword = ''
      passwordForm.confirmPassword = ''
    }
  } catch (error) {
    if (error instanceof Error) {
      ElMessage.error(error.message)
    } else {
      ElMessage.error('密码修改失败')
    }
  } finally {
    isSubmitting.value = false
  }
}

// 密码规则显示控制
const showPasswordRules = ref(false)
const isPasswordFocused = ref(false)

// 计算是否应该显示规则
const shouldShowRules = computed(() => {
  const hasInvalidRules = !(
    hasUpperCase.value &&
    hasLowerCase.value &&
    hasNumber.value &&
    hasSpecialChar.value &&
    isLengthValid.value
  )
  return showPasswordRules.value || (passwordForm.newPassword && hasInvalidRules)
})

// 处理密码输入框失焦
const handlePasswordBlur = () => {
  isPasswordFocused.value = false
  if (!passwordForm.newPassword) {
    showPasswordRules.value = false
  }
}

// 处理鼠标离开
const handlePasswordMouseLeave = () => {
  if (!isPasswordFocused.value && !passwordForm.newPassword) {
    showPasswordRules.value = false
  }
}

// 计算密码强度等级
const passwordStrengthLevel = computed(() => {
  const metRules = [
    hasUpperCase.value,
    hasLowerCase.value,
    hasNumber.value,
    hasSpecialChar.value,
    isLengthValid.value
  ].filter(Boolean).length

  return metRules
})

// 判断是否所有规则都满足
const allRulesMet = computed(() => {
  return passwordStrengthLevel.value === 5
})
</script>

<style scoped>
.profile-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.password-input-wrapper {
  position: relative;
  width: 100%;
}

.password-strength-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 8px;
}

.strength-bar {
  width: 40px;
  height: 4px;
  background: var(--el-border-color-lighter);
  border-radius: 2px;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;

  &.active::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    border-radius: 2px;
    transition: all 0.3s ease;
  }

  &.level-1::after {
    width: 20%;
    background-color: var(--el-color-danger);
  }

  &.level-2::after {
    width: 40%;
    background-color: var(--el-color-warning);
  }

  &.level-3::after {
    width: 60%;
    background-color: var(--el-color-warning);
  }

  &.level-4::after {
    width: 80%;
    background-color: var(--el-color-success);
  }

  &.level-5::after {
    width: 100%;
    background-color: var(--el-color-success);
  }
}

.password-rules-icon {
  font-size: 16px;
  color: var(--el-text-color-secondary);
  cursor: pointer;
  transition: all 0.3s ease;

  &.rules-met {
    color: var(--el-color-success);
  }

  &:hover {
    transform: scale(1.1);
  }
}

.password-rules {
  padding: 12px;
  min-width: 200px;
}

.rules-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.rule-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--el-text-color-secondary);
  transition: all 0.3s ease;

  .el-icon {
    font-size: 16px;
    color: var(--el-color-danger);
    transition: all 0.3s ease;

    &.rule-met {
      color: var(--el-color-success);
    }
  }

  &.rule-met {
    color: var(--el-color-success);
  }
}

.password-rules-tooltip {
  padding: 0 !important;
  background: var(--el-bg-color) !important;
  border: 1px solid var(--el-border-color-light) !important;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1) !important;
}
</style> 