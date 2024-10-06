//Handle chack is null
export const isNull = (field) => {
    return (
      field === undefined ||
      field === "undefined" ||
      field === "" ||
      field === null ||
      field === "null"
    ); 
  };

  //Handle to check valid json
  export const isValidJson = (string) => {
    try {
      JSON.parse(string); 
      return true;        
    } catch (error) {
      return false;       
    }
  };
  
// Handle get token
 export const getToken = () => {
    let token = null;
    if (typeof window !== 'undefined') {
      const authUser = localStorage.getItem("authUser");
      if (isValidJson(authUser)) {
        const parsedUser = JSON.parse(authUser);
        token = parsedUser?.token;
      }
    }
    return token; 
  };

  export const getUserId = () => {
    let token = null;
    if (typeof window !== 'undefined') {
      const authUser = localStorage.getItem("authUser");
      if (isValidJson(authUser)) {
        const parsedUser = JSON.parse(authUser);
        token = parsedUser?.id;
      }
    }
    return token; 
  };
  