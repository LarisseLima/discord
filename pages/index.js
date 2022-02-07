import { Box, Button, Text, TextField, Image } from '@skynexui/components';
import React from 'react';
import { useRouter } from 'next/router';
import appConfig from '../config.json';

function Title(props) {
 const Tag = props.tag || 'h1';
 return (
  <>
   <Tag>{props.children}</Tag>
   <style jsx>{`
            ${Tag} {
                color: ${appConfig.theme.colors.neutrals['000']};
                font-size: 28px;
                font-weight:500;
                font-family: 'Ink Free';
            }
            `}</style>
  </>
 );
}

export default function PaginaInicial() {
 const [username, setUsername] = React.useState('');
 const validateInput = username.length > 2
 const router = useRouter();

 return (
  <>
   <Box
    styleSheet={{
     display: 'flex', alignItems: 'center', justifyContent: 'center',
     backgroundImage: 'url(https://images.unsplash.com/photo-1604430352940-cf2acfb26ea9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1887&q=80)',
     backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
    }}
   >
    <Box
     styleSheet={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: {
       xs: 'column',
       sm: 'row',
      },
      width: '100%', maxWidth: '700px',
      borderRadius: '5px', padding: '32px', margin: '16px',
      boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
      backgroundColor: appConfig.theme.colors.neutrals[100],
     }}
    >
     { }
     <Box
      as="form"
      onSubmit={function (event) {
       event.preventDefault()
       router.push(`/chat?username=${username}`)
      }}
      styleSheet={{
       display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
       width: { xs: '100%', sm: '50%' }, textAlign: 'center', marginBottom: '32px',
      }}
     >
      <Title tag="h2">Welcome Back!</Title>
      <Text variant="body3" styleSheet={{ marginBottom: '32px', color: appConfig.theme.colors.neutrals[200] }}>
       {appConfig.name}
      </Text>

      { }

      <TextField
       value={username}
       onChange={function (event) {
        const newValue = event.target.value;
        setUsername(newValue)
       }}
       placeholder='Digite o seu usuário do Github...'
       fullWidth
       textFieldColors={{
        neutral: {
         textColor: appConfig.theme.colors.neutrals["000"],
         mainColor: appConfig.theme.colors.primary[500],
         mainColorHighlight: appConfig.theme.colors.neutrals["000"],
         backgroundColor: appConfig.theme.colors.neutrals[100],
        },
       }}
      />
      <Button
       type='submit'
       label='Login'
       fullWidth
       buttonColors={{
        contrastColor: appConfig.theme.colors.neutrals["000"],
        mainColor: appConfig.theme.colors.neutrals[100],
        mainColorLight: appConfig.theme.colors.primary[100],
        mainColorStrong: appConfig.theme.colors.primary[500],
       }}
      />
     </Box>
     { }


     { }
     <Box
      styleSheet={{
       display: 'flex',
       flexDirection: 'column',
       alignItems: 'center',
       maxWidth: '200px',
       padding: '16px',
       backgroundColor: appConfig.theme.colors.neutrals[100],
       border: '1px solid',
       borderColor: appConfig.theme.colors.neutrals[400],
       borderRadius: '10px',
       flex: 1,
       minHeight: '240px',
      }}
     >
      <Image
       styleSheet={{
        borderRadius: '50%',
        marginBottom: '16px',
       }}
       src={validateInput ? `https://github.com/${username}.png` : 'https://i.pinimg.com/originals/11/8e/6f/118e6f39fac9344d6589c84d5ee9e667.png'}

      />
      <Text
       variant="body4"
       tag={validateInput ? "a" : "span"}
       target="_blank"
       href={`https://github.com/${username}`}
       styleSheet={{
        color: appConfig.theme.colors.neutrals[200],
        backgroundColor: appConfig.theme.colors.primary[999],
        border: '1px solid',
        borderColor: appConfig.theme.colors.neutrals[400],
        borderRadius: '10px',
        padding: '3px 10px',
        borderRadius: '1000px',
       }}
      >
       {username || "GitHub"}
      </Text>
     </Box>
     { }
    </Box>
   </Box>
  </>
 );
}
