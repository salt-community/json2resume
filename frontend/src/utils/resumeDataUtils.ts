import type { ResumeData } from '@/types'

/**
 * Utility functions for common resume data state updates
 */

export const resumeDataUtils = {
  /**
   * Add a new item to an array field in resume data
   */
  addItem<T extends keyof ResumeData>(
    resumeData: ResumeData,
    field: T,
    newItem: ResumeData[T] extends Array<infer U> ? U : never,
  ): ResumeData {
    const currentArray = (resumeData[field] as Array<any>) || []
    return {
      ...resumeData,
      [field]: [...currentArray, newItem],
    }
  },

  /**
   * Update an item in an array field at a specific index
   */
  updateItem<T extends keyof ResumeData>(
    resumeData: ResumeData,
    field: T,
    index: number,
    updates: Partial<ResumeData[T] extends Array<infer U> ? U : never>,
  ): ResumeData {
    const currentArray = (resumeData[field] as Array<any>) || []
    const updatedArray = [...currentArray]
    updatedArray[index] = { ...updatedArray[index], ...updates }
    return {
      ...resumeData,
      [field]: updatedArray,
    }
  },

  /**
   * Remove an item from an array field at a specific index
   */
  removeItem<T extends keyof ResumeData>(
    resumeData: ResumeData,
    field: T,
    index: number,
  ): ResumeData {
    const currentArray = (resumeData[field] as Array<any>) || []
    const updatedArray = currentArray.filter((_, i) => i !== index)
    return {
      ...resumeData,
      [field]: updatedArray,
    }
  },

  /**
   * Move an item in an array field up or down
   */
  moveItem<T extends keyof ResumeData>(
    resumeData: ResumeData,
    field: T,
    index: number,
    direction: 'up' | 'down',
  ): ResumeData {
    const currentArray = (resumeData[field] as Array<any>) || []
    const newIndex = direction === 'up' ? index - 1 : index + 1

    if (newIndex >= 0 && newIndex < currentArray.length) {
      const updatedArray = [...currentArray]
      const [movedItem] = updatedArray.splice(index, 1)
      updatedArray.splice(newIndex, 0, movedItem)
      return {
        ...resumeData,
        [field]: updatedArray,
      }
    }

    return resumeData
  },

  /**
   * Update a specific field in the basics section
   */
  updateBasics(
    resumeData: ResumeData,
    updates: Partial<ResumeData['basics']>,
  ): ResumeData {
    return {
      ...resumeData,
      basics: {
        ...(resumeData.basics || { enabled: true }),
        ...updates,
      },
    }
  },

  /**
   * Add a sub-item (like highlights) to an item in an array field
   */
  addSubItem<T extends keyof ResumeData>(
    resumeData: ResumeData,
    field: T,
    itemIndex: number,
    subField: string,
    newSubItem: any,
  ): ResumeData {
    const currentArray = (resumeData[field] as Array<any>) || []
    const updatedArray = [...currentArray]
    const item = updatedArray[itemIndex]
    const currentSubItems = (item[subField] as Array<any>) || []
    updatedArray[itemIndex] = {
      ...item,
      [subField]: [...currentSubItems, newSubItem],
    }
    return {
      ...resumeData,
      [field]: updatedArray,
    }
  },

  /**
   * Update a sub-item (like highlights) in an item in an array field
   */
  updateSubItem<T extends keyof ResumeData>(
    resumeData: ResumeData,
    field: T,
    itemIndex: number,
    subField: string,
    subItemIndex: number,
    value: any,
  ): ResumeData {
    const currentArray = (resumeData[field] as Array<any>) || []
    const updatedArray = [...currentArray]
    const item = updatedArray[itemIndex]
    const currentSubItems = (item[subField] as Array<any>) || []
    currentSubItems[subItemIndex] = value
    updatedArray[itemIndex] = {
      ...item,
      [subField]: currentSubItems,
    }
    return {
      ...resumeData,
      [field]: updatedArray,
    }
  },

  /**
   * Remove a sub-item (like highlights) from an item in an array field
   */
  removeSubItem<T extends keyof ResumeData>(
    resumeData: ResumeData,
    field: T,
    itemIndex: number,
    subField: string,
    subItemIndex: number,
  ): ResumeData {
    const currentArray = (resumeData[field] as Array<any>) || []
    const updatedArray = [...currentArray]
    const item = updatedArray[itemIndex]
    const currentSubItems = (item[subField] as Array<any>) || []
    updatedArray[itemIndex] = {
      ...item,
      [subField]: currentSubItems.filter((_, i) => i !== subItemIndex),
    }
    return {
      ...resumeData,
      [field]: updatedArray,
    }
  },
}

/**
 * Create a setter function that combines resume data utils with setResumeData
 */
export const createResumeDataSetter = (
  getCurrentResumeData: () => ResumeData,
  setResumeData: (data: ResumeData) => void,
) => {
  return {
    addItem: <T extends keyof ResumeData>(field: T, newItem: any) => {
      setResumeData(
        resumeDataUtils.addItem(getCurrentResumeData(), field, newItem),
      )
    },

    updateItem: <T extends keyof ResumeData>(
      field: T,
      index: number,
      updates: any,
    ) => {
      setResumeData(
        resumeDataUtils.updateItem(
          getCurrentResumeData(),
          field,
          index,
          updates,
        ),
      )
    },

    removeItem: <T extends keyof ResumeData>(field: T, index: number) => {
      setResumeData(
        resumeDataUtils.removeItem(getCurrentResumeData(), field, index),
      )
    },

    moveItem: <T extends keyof ResumeData>(
      field: T,
      index: number,
      direction: 'up' | 'down',
    ) => {
      setResumeData(
        resumeDataUtils.moveItem(
          getCurrentResumeData(),
          field,
          index,
          direction,
        ),
      )
    },

    updateBasics: (updates: Partial<ResumeData['basics']>) => {
      setResumeData(
        resumeDataUtils.updateBasics(getCurrentResumeData(), updates),
      )
    },

    addSubItem: <T extends keyof ResumeData>(
      field: T,
      itemIndex: number,
      subField: string,
      newSubItem: any,
    ) => {
      setResumeData(
        resumeDataUtils.addSubItem(
          getCurrentResumeData(),
          field,
          itemIndex,
          subField,
          newSubItem,
        ),
      )
    },

    updateSubItem: <T extends keyof ResumeData>(
      field: T,
      itemIndex: number,
      subField: string,
      subItemIndex: number,
      value: any,
    ) => {
      setResumeData(
        resumeDataUtils.updateSubItem(
          getCurrentResumeData(),
          field,
          itemIndex,
          subField,
          subItemIndex,
          value,
        ),
      )
    },

    removeSubItem: <T extends keyof ResumeData>(
      field: T,
      itemIndex: number,
      subField: string,
      subItemIndex: number,
    ) => {
      setResumeData(
        resumeDataUtils.removeSubItem(
          getCurrentResumeData(),
          field,
          itemIndex,
          subField,
          subItemIndex,
        ),
      )
    },

    updateMeta: (updates: Partial<ResumeData['meta']>) => {
      const current = getCurrentResumeData()
      setResumeData({
        ...current,
        meta: {
          ...current.meta,
          ...updates,
        },
      })
    },
  }
}
