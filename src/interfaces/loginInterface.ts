export interface loginData{
    email:string,
    password:string
}

// export interface LoginState{
//     loginData:LoginData
// }
// interface LoginData{
//     token:string,
//     isLoading:boolean,
//     isSuccess:boolean,
//     error: ''
// }

export interface UserData {
    _id: string;
    name: string;
    email: string;
    dateOfBirth: string;
    gender: string;
    photo: string;
    createdAt: string;
    passwordChangedAt: string;
  }
  