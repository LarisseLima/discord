import { Box, Text, TextField, Image, Button, Icon } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import { ButtonSendSticker } from '../src/components/ButtonSendSticker';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0Mzg0MjgyMSwiZXhwIjoxOTU5NDE4ODIxfQ.vwyary8858x27bF4hEW0gJ1xRIIPUPkhuBAp0_uTPEM';
const SUPABASE_URL = 'https://eioxvajedyzmwhgvgjwn.supabase.co';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function escutaMensagensEmTempoReal(adicionaMensagem) {
 return supabaseClient
  .from('mensagens')
  .on('INSERT', (respostaLive) => {
   adicionaMensagem(respostaLive.new);
  })
  .subscribe();
}

export default function ChatPage() {
 const router = useRouter();
 const usuarioLogado = router.query.username;
 const [mensagem, setMensagem] = React.useState('');
 const [listaDeMensagens, setListaDeMensagens] = React.useState([]);

 React.useEffect(() => {
  supabaseClient
   .from('mensagens')
   .select('*')
   .order('id', { ascending: false })
   .then(({ data }) => {
    setListaDeMensagens(data);
   });

  const subscription = escutaMensagensEmTempoReal((novaMensagem) => {
   console.log('Nova mensagem:', novaMensagem);
   console.log('listaDeMensagens:', listaDeMensagens);
   setListaDeMensagens((valorAtualDaLista) => {
    console.log('valorAtualDaLista:', valorAtualDaLista);
    return [
     novaMensagem,
     ...valorAtualDaLista,
    ]
   });
  });

  return () => {
   subscription.unsubscribe();
  }
 }, []);

 function handleNovaMensagem(novaMensagem) {
  const mensagem = {
   de: usuarioLogado,
   texto: novaMensagem,
  };

  supabaseClient
   .from('mensagens')
   .insert([
    mensagem
   ])
   .then(({ data }) => {
   });

  setMensagem('');
 }

 function handleDeletaMensagem(mensagemAtual) {
  supabaseClient
   .from("mensagens")
   .delete()
   .match({ id: mensagemAtual.id })
   .then(({ data }) => {
    const listaDeMensagensFiltrada = listaDeMensagens.filter((mensagem) => {
     return mensagem.id != data[0].id;
    });
    setListaDeMensagens(listaDeMensagensFiltrada);
   });
 }

 return (
  <Box
   styleSheet={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    backgroundColor: appConfig.theme.colors.neutrals[900],
    backgroundImage: 'url(https://images.unsplash.com/photo-1604430352940-cf2acfb26ea9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1887&q=80)',
    backgroundRepeat: 'no-repeat', backgroundSize: 'cover',
    color: appConfig.theme.colors.neutrals['100']
   }}
  >
   <Box
    styleSheet={{
     display: 'flex',
     flexDirection: 'column',
     flex: 1,
     boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
     borderRadius: '10px',
     backgroundColor: appConfig.theme.colors.neutrals[900],
     height: '100%',
     maxWidth: '95%',
     maxHeight: '95vh',
     padding: '32px',
    }}
   >
    <Header />
    <Box
     styleSheet={{
      position: 'relative',
      display: 'flex',
      flex: 1,
      height: '80%',
      backgroundColor: appConfig.theme.colors.neutrals[900],
      flexDirection: 'column',
      borderRadius: '5px',
      padding: '16px',
     }}
    >
     <MessageList
      mensagens={listaDeMensagens}
      handleDeletaMensagem={handleDeletaMensagem}
     />
     { }
     <Box
      as="form"
      styleSheet={{
       display: 'flex',
       alignItems: 'center',
      }}
     >
      <TextField
       value={mensagem}
       onChange={(event) => {
        const valor = event.target.value;
        setMensagem(valor);
       }}
       onKeyPress={(event) => {
        if (event.key === 'Enter') {
         event.preventDefault();
         handleNovaMensagem(mensagem);
        }
       }}
       placeholder="Insira sua mensagem aqui..."
       type="textarea"
       styleSheet={{
        width: '100%',
        border: '0',
        resize: 'none',
        borderRadius: '5px',
        padding: '15px 8px',
        marginRight: '12px',
        backgroundColor: appConfig.theme.colors.primary[800],
        color: appConfig.theme.colors.neutrals["000"],
       }}
      />
      { }
      <ButtonSendSticker
       onStickerClick={(sticker) => {
        handleNovaMensagem(':sticker: ' + sticker);
       }}
      />
      <Button styleSheet={{
       borderRadius: '50%',
       minWidth: '50px',
       minHeight: '50px',
       fontSize: '20px',
       marginBottom: '8px',
       margin: '5px',
       lineHeight: '',
       display: 'flex',
       alignItems: 'center',
       justifyContent: 'center',
      }}
       iconName="FaPaperPlane"
       type="button"
       variant='secondary'
       colorVariant='positive'

       onClick={(event) => {
        event.preventDefault();
        handleNovaMensagem(mensagem);
       }}
      />
     </Box>
    </Box>
   </Box>
  </Box>
 )
}

function Header() {
 return (
  <>
   <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
    <Text variant='heading4'>
     CHAT
    </Text>
    <Button
     variant='secondary'
     colorVariant='light'
     label='Logout'
     href="/"
    />
   </Box>
  </>
 )
}

function MessageList(props) {
 console.log("MessageList", props);

 const handleDeletaMensagem = props.handleDeletaMensagem;
 return (
  <Box
   tag="ul"
   styleSheet={{
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column-reverse',
    flex: 1,
    color: appConfig.theme.colors.neutrals["000"],
    marginBottom: '16px',
   }}
  >
   {props.mensagens.map((mensagem) => {
    return (
     <Text
      key={mensagem.id}
      tag="li"
      styleSheet={{
       borderRadius: '5px',
       padding: '6px',
       marginBottom: '12px',
       hover: {
        backgroundColor: appConfig.theme.colors.neutrals[100],
       }
      }}
     >
      <Box
       styleSheet={{
        marginBottom: '8px',
       }}
      >
       <Image
        styleSheet={{
         width: '20px',
         height: '20px',
         borderRadius: '50%',
         display: 'inline-block',
         marginRight: '8px',
        }}
        src={`https://github.com/${mensagem.de}.png`}
       />
       <Text tag="strong">
        {mensagem.de}
       </Text>
       <Text
        styleSheet={{
         fontSize: '10px',
         marginLeft: '8px',
         color: appConfig.theme.colors.neutrals[200],
        }}
        tag="span"
       >
        {new Date().toLocaleDateString("pt-br", { hour: "numeric", minute: "numeric", second: "numeric" })}
       </Text>

       <Icon
        name={"FaTrash"}
        styleSheet={{
         marginLeft: "12px",
         width: "15px",
         height: "15px",
         color: appConfig.theme.colors.primary["100"],
         hover: {
          color: "orange",
         },
         display: "inline-block",
        }}
        onClick={(event) => {
         event.preventDefault();
         handleDeletaMensagem(mensagem);
        }}
       />

      </Box>

      {mensagem.texto.startsWith(':sticker:')
       ? (
        <Image src={mensagem.texto.replace(':sticker:', '')} />
       )
       : (
        mensagem.texto
       )}
      { }
      { }
     </Text>
    );
   })}
  </Box>
 );
}