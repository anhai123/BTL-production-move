export const handleProductCategoryReturnedFromBE = (arrayOfProductCategory) => {
  const ids = arrayOfProductCategory.map((x) => x.id);
  let result = arrayOfProductCategory
    .map((parent) => {
      const children = arrayOfProductCategory.filter((child) => {
        if (
          child.id !== child.id_danh_muc_cha &&
          child.id_danh_muc_cha === parent.id
        ) {
          return true;
        }

        return false;
      });

      if (children.length) {
        parent.children = children;
      }

      return parent;
    })
    .filter((obj) => {
      if (
        obj.id === obj.id_danh_muc_cha ||
        !ids.includes(obj.id_danh_muc_cha)
      ) {
        // include ultimate parents and orphans at root
        return true;
      }

      return false;
    });
  const deQuy = (arrayy) => {
    for (let i = 0; i < arrayy.length; i++) {
      arrayy[i].key = arrayy[i].id;
      arrayy[i].value = arrayy[i].id;
      arrayy[i].title = arrayy[i].ten_danh_muc_sp;
      if (arrayy[i].children) {
        arrayy[i].children = deQuy(arrayy[i].children);
      }
    }
    return arrayy.sort((a, b) => {
      return a.stt - b.stt;
    });
  };
  result = deQuy(result);
  console.log(result);
  return result;
};

export const formItemLayout = {
  labelCol: {
    offset: 0,
    span: 12,
  },
  wrapperCol: {
    offset: 0,
    span: 12,
  },
};
