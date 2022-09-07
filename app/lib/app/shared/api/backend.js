import ApiRequest from '../ApiRequest.js'

/**
 * @param {object} params
 * @param {{}} params.csaf
 * @param {string} params.summary
 * @param {string} params.legacyVersion
 */
export async function createAdvisory({ csaf, summary, legacyVersion }) {
  const res = await new CSRFAPIRequest(
    new Request('/api/v1/advisories', { method: 'POST' })
  )
    .setJsonRequestBody({ csaf, summary, legacyVersion })
    .send()

  /** @type {{ id: string; revision: string }} */
  const advisoryData = await res.json()
  return advisoryData
}

/**
 * @param {object} params
 * @param {string} params.advisoryId
 * @param {string} params.revision
 * @param {{}} params.csaf
 * @param {string} params.summary
 * @param {string} params.legacyVersion
 */
export async function updateAdvisory({
  advisoryId,
  revision,
  csaf,
  summary,
  legacyVersion,
}) {
  const apiURL = new URL(
    `/api/v1/advisories/${advisoryId}/`,
    window.location.href
  )
  apiURL.searchParams.set('revision', revision)
  await new CSRFAPIRequest(
    new Request(apiURL.toString(), {
      method: 'PATCH',
    })
  )
    .setJsonRequestBody({ csaf, summary, legacyVersion })
    .send()
}

/**
 * @param {object} params
 * @param {string} params.advisoryId
 */
export async function getAdvisoryDetail({ advisoryId }) {
  return (
    await new CSRFAPIRequest(
      new Request(`/api/v1/advisories/${advisoryId}/`)
    ).send()
  ).json()
}

/**
 * @param {object} params
 * @param {string} params.advisoryId
 * @param {string} params.revision
 * @param {string} params.workflowState
 * @param {string | null} params.documentTrackingStatus
 * @param {Date | null} params.proposedTime
 */
export async function changeWorkflowState({
  advisoryId,
  revision,
  workflowState,
  documentTrackingStatus,
  proposedTime,
}) {
  const newWorkflowState = workflowState
  const changeWorkflowStateURL = new URL(
    `/api/v1/advisories/${advisoryId}/workflowstate/${newWorkflowState}`,
    window.location.href
  )
  changeWorkflowStateURL.searchParams.set('revision', revision)
  if (typeof documentTrackingStatus === 'string') {
    changeWorkflowStateURL.searchParams.set(
      'documentTrackingStatus',
      documentTrackingStatus
    )
  }
  if (proposedTime !== null) {
    changeWorkflowStateURL.searchParams.set(
      'proposedTime',
      proposedTime.toISOString()
    )
  }
  return new CSRFAPIRequest(
    new Request(changeWorkflowStateURL.toString(), {
      method: 'PATCH',
    })
  ).send()
}

/**
 * @param {object} params
 * @param {string} params.advisoryId
 * @param {string} params.revision
 */
export async function createNewVersion({ advisoryId, revision }) {
  const createNewVersionAPIURL = new URL(
    `/api/v1/advisories/${advisoryId}/createNewVersion`,
    window.location.href
  )
  createNewVersionAPIURL.searchParams.set('revision', revision)
  await new CSRFAPIRequest(
    new Request(createNewVersionAPIURL.href, {
      method: 'PATCH',
    })
  ).send()
}

export async function getTemplates() {
  return new CSRFAPIRequest(new Request('/api/v1/advisories/templates'))
    .setContentType('application/json')
    .send()
    .then((res) => res.json())
}

/**
 * @param {object} params
 * @param {string} params.templateId
 * @returns
 */
export async function getTemplateContent({ templateId }) {
  return new CSRFAPIRequest(
    new Request(`/api/v1/advisories/templates/${templateId}`)
  )
    .setContentType('application/json')
    .send()
    .then((templateContentRes) => templateContentRes.json())
}

/**
 * @param {object} params
 * @param {string} params.advisoryId
 * @param {string} params.revision
 */
export async function deleteAdvisory({ advisoryId, revision }) {
  const deleteURL = new URL(
    `/api/v1/advisories/${advisoryId}/`,
    window.location.href
  )
  deleteURL.searchParams.set('revision', revision)
  await new CSRFAPIRequest(
    new Request(deleteURL.toString(), { method: 'DELETE' })
  ).send()
}

export async function getAdvisories() {
  const res = await new CSRFAPIRequest(new Request('/api/v1/advisories/'))
    .setContentType('application/json')
    .send()
  const advisories = await res.json()
  return advisories
}

export async function getAboutInfo() {
  const response = await new ApiRequest(new Request('/api/v1/about'))
    .setContentType('text/html')
    .send()

  return await response.json()
}

class CSRFAPIRequest extends APIRequest {
  /**
   * @param {Request} request
   */
  constructor(request) {
    super(request)
    if (!['GET', 'HEAD'].includes(request.method)) {
      const headers = new Headers(request.headers)
      const regex = /^([^=]+)=(.+)$/
      const xsrfCookie = document.cookie
        .split('; ')
        .filter((c) => c)
        .map((s) => {
          const m = s.match(regex)
          if (!m) throw new Error('Failed to parse cookies')
          return /** @type {const} */ ([m[1], m[2]])
        })
        .find(([name]) => name === 'XSRF-TOKEN')
      if (xsrfCookie) {
        headers.set('X-XSRF-TOKEN', xsrfCookie[1])
      }
      this.request = new Request(request, {
        headers,
      })
    }
  }
}
