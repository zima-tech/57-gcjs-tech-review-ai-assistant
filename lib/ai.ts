const baseUrl = process.env.GLM_BASE_URL || 'https://open.bigmodel.cn/api/paas/v4';
const model = process.env.GLM_MODEL || 'GLM-4.7-Flash';

async function callGlm(systemPrompt: string, userPrompt: string) {
  const apiKey = process.env.GLM_API_KEY;

  if (!apiKey) {
    return null;
  }

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.4
      })
    });

    if (!response.ok) {
      return null;
    }

    const json = await response.json();
    return json?.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}

const fallbackByScene: Record<string, string> = {
  '审查总览': '建议优先处置高风险合规偏差和跨专业接口问题，再安排参数复核和文本规范性修订。',
  '审查任务': '建议按项目阶段和专业维度分层审查，先锁定施工图和初设中的高风险任务。',
  '合规校核': '建议对关键规范条款设置必审清单，先校核红线控制、净距、荷载和排水指标。',
  '优化建议': '建议把问题分为必改项、优化项、建议项三类，避免设计调整失焦。',
  '审查报告': '建议报告先固化问题摘要、问题点位、整改建议和结论等级四大段落。',
  'AI 洞察': '建议结合专业分布、问题等级和阶段差异形成周审查重点和设计优化方向。'
};

export async function generateReviewAssistantReply(scene: string, prompt: string) {
  const remoteReply = await callGlm(
    '你是一名工程建设技术审查助手，请围绕设计文件审查、合规性校核和方案优化给出准确、简洁、可执行的建议。',
    `场景：${scene}\n问题：${prompt}\n请输出审查判断、风险提示和下一步建议。`
  );

  return {
    content: remoteReply || fallbackByScene[scene] || '建议先完成关键专业和关键条款审查，再汇总问题清单和整改建议。',
    source: remoteReply ? 'glm' : 'fallback'
  };
}
