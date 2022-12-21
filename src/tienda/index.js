import create from 'zustand';
import { persist } from "zustand/middleware"


const useStore = create(persist((set, get) => ({
    usuario: {   
        id: '', 
        nombre: '', 
        apellido: '',
        email: '',
        logueado: false,
        dni: '',
        celular:'',
        uid: '',
        rol:0,
    },
    loginUsuario: (usuarioNvo) => set({ usuario :usuarioNvo}),
    salirUsuario: () => set({ usuario: {   
        id: '', 
        nombre: '', 
        apellido: '',
        email: '',
        logueado: false,
        dni: '',
        celular:'',
        uid: '',
        rol:0,
    }
    })
}),
    {
    name: "usuario-storage", // unique name
    getStorage: () => sessionStorage, // (optional) by default the 'localStorage' is used
    }
))

const useStoreLoading = create(set => ({
    loading: false,
    loadingInicio: () => set({ loading :true}),
    loadingFin: () => set({ loading: false})
}))



export const useUsuarioStore = useStore;
export {useStoreLoading,
}
//export { db, auth, firebaseApp};


