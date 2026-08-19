import { useNavigate } from 'react-router-dom';
import NavMenu from '../components/NavMenu';

const C = {
  bg: '#06080f', bgCard: '#0d1117', bgCardHover: '#111827',
  border: 'rgba(255,255,255,0.07)', text: '#f1f5f9',
  textSub: '#94a3b8', textDim: '#475569',
  red: '#ff3b3b', gold: '#ffd700', green: '#00e676',
};

function LegalLayout({ children, title, subtitle }) {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <NavMenu backLabel="← Retour" backPath="/" centerLabel={title} />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, color: C.red, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>
            {subtitle}
          </div>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 900, color: C.text, letterSpacing: '-0.03em', lineHeight: 1.2 }}>
            {title}
          </h1>
          <div style={{ marginTop: 12, height: 2, width: 60, background: `linear-gradient(90deg, ${C.red}, ${C.gold})`, borderRadius: 2 }} />
        </div>
        <div style={{ lineHeight: 1.8, fontSize: 14, color: C.textSub }}>
          {children}
        </div>
      </div>
    </div>
  );
}

const H2 = ({ children }) => (
  <h2 style={{ fontSize: 18, fontWeight: 800, color: C.text, marginTop: 36, marginBottom: 12, borderLeft: `3px solid ${C.red}`, paddingLeft: 14, letterSpacing: '-0.01em' }}>
    {children}
  </h2>
);

const H3 = ({ children }) => (
  <h3 style={{ fontSize: 15, fontWeight: 700, color: C.text, marginTop: 20, marginBottom: 8 }}>
    {children}
  </h3>
);

const P = ({ children }) => (
  <p style={{ margin: '0 0 14px', color: C.textSub, lineHeight: 1.8 }}>{children}</p>
);

const Ul = ({ items }) => (
  <ul style={{ margin: '0 0 14px', paddingLeft: 20, color: C.textSub }}>
    {items.map((item, i) => <li key={i} style={{ marginBottom: 6 }}>{item}</li>)}
  </ul>
);

const InfoBox = ({ children, color = C.gold }) => (
  <div style={{ background: `${color}10`, border: `1px solid ${color}30`, borderRadius: 12, padding: '14px 18px', marginBottom: 20, fontSize: 13, color: C.textSub }}>
    {children}
  </div>
);

// ─── RGPD ─────────────────────────────────────────────────────────────────────
export function RGPD() {
  return (
    <LegalLayout title="Politique de confidentialité" subtitle="Données personnelles · RGPD">
      <InfoBox color={C.green}>
        Dernière mise à jour : 30 juin 2026 — Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.
      </InfoBox>

      <H2>1. Responsable du traitement</H2>
      <P>Le responsable du traitement des données personnelles collectées via le site <strong style={{ color: C.text }}>prono-sport.io</strong> est :</P>
      <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px', marginBottom: 20 }}>
        <div style={{ color: C.text, fontWeight: 700, marginBottom: 4 }}>Prono Sport</div>
        <div>Email : <a href="mailto:contact@prono-sport.io" style={{ color: C.red }}>contact@prono-sport.io</a></div>
        <div>Site web : <a href="https://prono-sport.io" style={{ color: C.red }}>prono-sport.io</a></div>
      </div>

      <H2>2. Données collectées</H2>
      <P>Lors de votre inscription et utilisation du service, nous collectons les données suivantes :</P>
      <Ul items={[
        'Prénom, nom (facultatif)',
        'Adresse email (obligatoire)',
        'Numéro de téléphone (facultatif)',
        'Données de paiement (traitées exclusivement par Stripe — nous ne stockons pas vos coordonnées bancaires)',
        'Historique des pronostics consultés',
        'Données de connexion (date, heure, adresse IP)',
      ]} />

      <H2>3. Finalités du traitement</H2>
      <P>Vos données sont utilisées pour :</P>
      <Ul items={[
        'Créer et gérer votre compte utilisateur',
        'Vous fournir les pronostics IA personnalisés',
        'Gérer votre abonnement et les paiements via Stripe',
        'Vous envoyer des notifications liées à votre compte (confirmation, factures)',
        'Améliorer nos services et analyser les usages',
        'Respecter nos obligations légales',
      ]} />

      <H2>4. Base légale</H2>
      <Ul items={[
        'Exécution du contrat : pour la fourniture du service',
        'Consentement : pour les communications marketing (opt-in)',
        'Intérêt légitime : pour la sécurité et l\'amélioration du service',
        'Obligation légale : pour la conservation des données comptables',
      ]} />

      <H2>5. Durée de conservation</H2>
      <Ul items={[
        'Données de compte : durée de l\'abonnement + 3 ans',
        'Données de paiement : 10 ans (obligation comptable)',
        'Logs de connexion : 12 mois',
        'Données supprimées sur demande dans les 30 jours',
      ]} />

      <H2>6. Partage des données</H2>
      <P>Nous ne vendons jamais vos données. Elles peuvent être partagées avec :</P>
      <Ul items={[
        'Stripe (paiements) — politique disponible sur stripe.com',
        'Clever Cloud (hébergement) — données stockées en Europe',
        'OpenAI (génération de pronostics IA) — données anonymisées',
      ]} />

      <H2>7. Vos droits</H2>
      <P>Conformément au RGPD, vous disposez des droits suivants :</P>
      <Ul items={[
        'Droit d\'accès à vos données personnelles',
        'Droit de rectification des données inexactes',
        'Droit à l\'effacement (« droit à l\'oubli »)',
        'Droit à la portabilité de vos données',
        'Droit d\'opposition au traitement',
        'Droit de retirer votre consentement à tout moment',
      ]} />
      <P>Pour exercer ces droits, contactez-nous à <a href="mailto:contact@prono-sport.io" style={{ color: C.red }}>contact@prono-sport.io</a>. Nous répondons dans un délai de 30 jours.</P>
      <P>Vous pouvez également introduire une réclamation auprès de la <strong style={{ color: C.text }}>CNIL</strong> (www.cnil.fr).</P>

      <H2>8. Cookies</H2>
      <P>Le site utilise uniquement des cookies fonctionnels nécessaires au bon fonctionnement du service (authentification, session). Aucun cookie publicitaire ou de tracking tiers n'est utilisé.</P>

      <H2>9. Sécurité</H2>
      <P>Nous mettons en œuvre des mesures techniques et organisationnelles appropriées : chiffrement HTTPS/TLS, hachage des mots de passe (bcrypt), accès restreint aux données, hébergement sécurisé en Europe.</P>
    </LegalLayout>
  );
}

// ─── CGV ──────────────────────────────────────────────────────────────────────
export function CGV() {
  return (
    <LegalLayout title="Conditions Générales de Vente" subtitle="CGV · Abonnements · Paiements">
      <InfoBox color={C.gold}>
        Dernière mise à jour : 30 juin 2026 — Ces CGV régissent l'utilisation des services payants de prono-sport.io.
      </InfoBox>

      <H2>1. Éditeur du service</H2>
      <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px', marginBottom: 20 }}>
        <div style={{ color: C.text, fontWeight: 700, marginBottom: 4 }}>Prono Sport</div>
        <div>Email : <a href="mailto:contact@prono-sport.io" style={{ color: C.red }}>contact@prono-sport.io</a></div>
        <div>Hébergement : Clever Cloud SAS, 3 rue de l'Allier, 75011 Paris</div>
      </div>

      <H2>2. Description des services</H2>
      <P>prono-sport.io propose des pronostics sportifs générés par intelligence artificielle pour tous les championnats et compétitions sportives. Les abonnements disponibles sont :</P>
      <div style={{ display: 'grid', gap: 12, marginBottom: 20 }}>
        {[
          { name: 'Plan Gratuit', price: '0 €/mois', features: '1 pronostic par jour, analyse basique' },
          { name: 'AI Plus', price: '4,99 €/mois', features: 'Pronostics illimités, score exact, analyse détaillée' },
          { name: 'AI Premium', price: '9,99 €/mois', features: 'Tout AI Plus + Live IA Coach, questions contextuelles en temps réel' },
        ].map(plan => (
          <div key={plan.name} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <div>
              <div style={{ fontWeight: 700, color: C.text }}>{plan.name}</div>
              <div style={{ fontSize: 12, color: C.textDim }}>{plan.features}</div>
            </div>
            <div style={{ fontWeight: 900, color: C.gold, fontSize: 16 }}>{plan.price}</div>
          </div>
        ))}
      </div>

      <H2>3. Commande et paiement</H2>
      <P>Les paiements sont traités de manière sécurisée par <strong style={{ color: C.text }}>Stripe</strong> (certifié PCI-DSS). Nous acceptons les cartes bancaires Visa, Mastercard et American Express.</P>
      <P>L'abonnement est activé immédiatement après confirmation du paiement. Une facture est envoyée automatiquement par email.</P>
      <P>Les prix sont indiqués en euros TTC. En tant que particulier résidant en France, la TVA applicable est de 20%.</P>

      <H2>4. Durée et renouvellement</H2>
      <P>Les abonnements sont souscrits pour une durée d'un mois, renouvelables automatiquement à la date anniversaire. Vous pouvez annuler à tout moment depuis votre espace client (section "Mes abonnements") ou via le portail Stripe.</P>
      <P>L'annulation prend effet à la fin de la période en cours — vous conservez l'accès jusqu'à cette date.</P>

      <H2>5. Droit de rétractation</H2>
      <P>Conformément à l'article L.221-28 du Code de la consommation, le droit de rétractation de 14 jours <strong style={{ color: C.text }}>ne s'applique pas</strong> aux contenus numériques fournis immédiatement après la souscription, avec votre accord exprès.</P>
      <P>Toutefois, si vous n'avez pas utilisé le service dans les 14 jours suivant votre abonnement, vous pouvez demander un remboursement à <a href="mailto:contact@prono-sport.io" style={{ color: C.red }}>contact@prono-sport.io</a>.</P>

      <H2>6. Limitation de responsabilité</H2>
      <InfoBox color={C.red}>
        ⚠️ Les pronostics fournis sont générés par intelligence artificielle à titre informatif uniquement. Ils ne constituent pas des conseils financiers ou d'investissement. Prono Sport ne peut être tenu responsable des pertes liées à l'utilisation de ces pronostics dans le cadre de paris sportifs.
      </InfoBox>
      <P>Le jeu d'argent comporte des risques. Jouez de manière responsable. En France, l'Autorité Nationale des Jeux (ANJ) propose des ressources d'aide : <a href="https://www.joueurs-info-service.fr" style={{ color: C.red }}>joueurs-info-service.fr</a> — 09 74 75 13 13.</P>

      <H2>7. Propriété intellectuelle</H2>
      <P>L'ensemble des contenus du site (pronostics, analyses, articles, code) est la propriété exclusive de Prono Sport. Toute reproduction sans autorisation est interdite.</P>

      <H2>8. Droit applicable</H2>
      <P>Les présentes CGV sont soumises au droit français. En cas de litige, les tribunaux compétents sont ceux du ressort du siège social de Prono Sport. Pour tout litige de consommation, vous pouvez recourir à la médiation via la plateforme européenne : <a href="https://ec.europa.eu/consumers/odr" style={{ color: C.red }}>ec.europa.eu/consumers/odr</a>.</P>

      <H2>9. Contact</H2>
      <P>Pour toute question relative à ces CGV : <a href="mailto:contact@prono-sport.io" style={{ color: C.red }}>contact@prono-sport.io</a></P>
    </LegalLayout>
  );
}

// ─── CONTACT ──────────────────────────────────────────────────────────────────
export function Contact() {
  const navigate = useNavigate();
  const [form, setForm] = React.useState({ nom: '', email: '', sujet: 'question', message: '' });
  const [sending, setSending] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nom || !form.email || !form.message) { setError('Tous les champs obligatoires doivent être remplis.'); return; }
    setSending(true); setError(null);
    try {
      const res = await fetch('https://app-7a3df0bb-9561-4735-b916-cfffb7487eba.cleverapps.io/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Erreur serveur');
      setSent(true);
    } catch {
      setError('Une erreur est survenue. Vous pouvez nous écrire directement à contact@prono-sport.io');
    } finally {
      setSending(false);
    }
  };

  const inputStyle = {
    width: '100%', background: 'rgba(255,255,255,0.05)',
    border: `1px solid ${C.border}`, borderRadius: 10,
    padding: '12px 16px', color: C.text, fontSize: 14,
    fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  return (
    <LegalLayout title="Nous contacter" subtitle="Support · Questions · Partenariats">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 40 }}>
        {[
          { icon: '📧', label: 'Email', value: 'contact@prono-sport.io', href: 'mailto:contact@prono-sport.io' },
          { icon: '⚽', label: 'Site', value: 'prono-sport.io', href: 'https://prono-sport.io' },
          { icon: '⏱️', label: 'Réponse', value: 'Sous 24-48h ouvrées', href: null },
        ].map(item => (
          <div key={item.label} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 18px' }}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>{item.icon}</div>
            <div style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{item.label}</div>
            {item.href ? (
              <a href={item.href} style={{ fontSize: 13, color: C.red, fontWeight: 600, textDecoration: 'none' }}>{item.value}</a>
            ) : (
              <div style={{ fontSize: 13, color: C.textSub }}>{item.value}</div>
            )}
          </div>
        ))}
      </div>

      {sent ? (
        <div style={{ background: `${C.green}10`, border: `1px solid ${C.green}40`, borderRadius: 16, padding: '32px', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
          <h3 style={{ fontSize: 20, fontWeight: 900, color: C.text, marginBottom: 8 }}>Message envoyé !</h3>
          <p style={{ color: C.textSub, marginBottom: 20 }}>Nous vous répondrons dans les 24-48h ouvrées.</p>
          <button onClick={() => navigate('/')} style={{ background: `linear-gradient(135deg, ${C.red}, #c62828)`, color: '#fff', border: 'none', borderRadius: 10, padding: '11px 24px', fontWeight: 900, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
            Retour aux pronostics →
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 16, padding: '28px 28px' }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.text, marginBottom: 24 }}>Envoyez-nous un message</div>

          {error && (
            <div style={{ background: `${C.red}10`, border: `1px solid ${C.red}30`, borderRadius: 10, padding: '10px 16px', marginBottom: 20, fontSize: 13, color: C.red }}>
              {error}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: 11, color: C.textDim, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Nom *</label>
              <input value={form.nom} onChange={e => setForm(p => ({ ...p, nom: e.target.value }))} placeholder="Votre nom" style={inputStyle}
                onFocus={e => e.target.style.borderColor = C.red} onBlur={e => e.target.style.borderColor = C.border} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: C.textDim, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Email *</label>
              <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="votre@email.com" style={inputStyle}
                onFocus={e => e.target.style.borderColor = C.red} onBlur={e => e.target.style.borderColor = C.border} />
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, color: C.textDim, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Sujet</label>
            <select value={form.sujet} onChange={e => setForm(p => ({ ...p, sujet: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="question">Question générale</option>
              <option value="abonnement">Problème d'abonnement</option>
              <option value="technique">Problème technique</option>
              <option value="partenariat">Partenariat / Presse</option>
              <option value="rgpd">Données personnelles (RGPD)</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 11, color: C.textDim, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Message *</label>
            <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} placeholder="Décrivez votre demande..." rows={5}
              style={{ ...inputStyle, resize: 'vertical', minHeight: 120 }}
              onFocus={e => e.target.style.borderColor = C.red} onBlur={e => e.target.style.borderColor = C.border} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontSize: 11, color: C.textDim, margin: 0 }}>
              * Champs obligatoires — Vos données sont protégées conformément à notre{' '}
              <a href="/rgpd" style={{ color: C.red }}>politique de confidentialité</a>
            </p>
            <button type="submit" disabled={sending} style={{
              background: sending ? 'rgba(255,255,255,0.08)' : `linear-gradient(135deg, ${C.red}, #c62828)`,
              color: sending ? C.textDim : '#fff', border: 'none', borderRadius: 12,
              padding: '12px 28px', fontWeight: 900, fontSize: 14, cursor: sending ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', boxShadow: sending ? 'none' : `0 4px 20px rgba(255,59,59,0.3)`,
            }}>
              {sending ? 'Envoi...' : 'Envoyer le message →'}
            </button>
          </div>
        </form>
      )}

      {/* FAQ rapide */}
      <div style={{ marginTop: 40 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: C.text, marginBottom: 16 }}>Questions fréquentes</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { q: 'Comment annuler mon abonnement ?', r: 'Depuis votre espace client → Mes abonnements → Portail Stripe, ou en nous contactant.' },
            { q: 'Les pronostics sont-ils garantis ?', r: 'Non. Les pronostics sont générés par IA à titre informatif. Le taux de réussite affiché est basé sur les données historiques réelles.' },
            { q: 'Comment fonctionne le Live IA Coach ?', r: 'Disponible en plan AI Premium, il vous permet de poser des questions en temps réel sur un match en cours et d\'obtenir des analyses instantanées.' },
            { q: 'Mes données bancaires sont-elles sécurisées ?', r: 'Oui. Les paiements sont traités par Stripe (certifié PCI-DSS). Nous ne stockons jamais vos coordonnées bancaires.' },
          ].map((faq, i) => (
            <div key={i} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 18px' }}>
              <div style={{ fontWeight: 700, color: C.text, fontSize: 13, marginBottom: 6 }}>❓ {faq.q}</div>
              <div style={{ fontSize: 13, color: C.textSub }}>{faq.r}</div>
            </div>
          ))}
        </div>
      </div>
    </LegalLayout>
  );
}

// Import React pour useState dans Contact
import React from 'react';
