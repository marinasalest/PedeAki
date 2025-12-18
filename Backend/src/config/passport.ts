import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const prismaClient = (await import('../prisma')).default;
    const user = await prismaClient.usuarios.findUnique({
      where: { id }
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Estratégia Facebook (apenas se configurado)
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: '/auth/facebook/callback',
        profileFields: ['id', 'displayName', 'email', 'birthday']
      },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const prismaClient = (await import('../prisma')).default;
        
        // Verifica se usuário já existe pelo Facebook ID
        let user = await prismaClient.usuarios.findUnique({
          where: { facebook_id: profile.id }
        });

        if (user) {
          return done(null, user);
        }

        // Verifica se usuário existe pelo email
        if (profile.emails && profile.emails[0]) {
          user = await prismaClient.usuarios.findUnique({
            where: { email: profile.emails[0].value }
          });

          if (user) {
            // Atualiza com Facebook ID
            user = await prismaClient.usuarios.update({
              where: { id: user.id },
              data: {
                facebook_id: profile.id,
                provider: 'facebook'
              }
            });
            return done(null, user);
          }
        }

        // Cria novo usuário
        user = await prismaClient.usuarios.create({
          data: {
            name: profile.displayName || 'Usuário Facebook',
            email: profile.emails?.[0]?.value || `${profile.id}@facebook.com`,
            facebook_id: profile.id,
            provider: 'facebook',
            cpf: null,
            data_nascimento: null,
            password: null,
            id_endereco: null
          }
        });

        return done(null, user);
      } catch (error: any) {
        return done(error, null);
      }
    }
  )
  );
}

// Estratégia Google (apenas se configurado)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
      },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const prismaClient = (await import('../prisma')).default;
        
        // Verifica se usuário já existe pelo Google ID
        let user = await prismaClient.usuarios.findUnique({
          where: { google_id: profile.id }
        });

        if (user) {
          return done(null, user);
        }

        // Verifica se usuário existe pelo email
        if (profile.emails && profile.emails[0]) {
          user = await prismaClient.usuarios.findUnique({
            where: { email: profile.emails[0].value }
          });

          if (user) {
            // Atualiza com Google ID
            user = await prismaClient.usuarios.update({
              where: { id: user.id },
              data: {
                google_id: profile.id,
                provider: 'google'
              }
            });
            return done(null, user);
          }
        }

        // Cria novo usuário
        user = await prismaClient.usuarios.create({
          data: {
            name: profile.displayName || profile.name?.givenName || 'Usuário Google',
            email: profile.emails?.[0]?.value || `${profile.id}@google.com`,
            google_id: profile.id,
            provider: 'google',
            cpf: null,
            data_nascimento: null,
            password: null,
            id_endereco: null
          }
        });

        return done(null, user);
      } catch (error: any) {
        return done(error, null);
      }
    }
  )
  );
}

export default passport;















