/* Shared H icon geometry. CSS tokens control every instance, including
   components inserted later by dialogs and the design editor. */
(() => {
  'use strict';
  if (!customElements.get('sps-chevron')) customElements.define('sps-chevron', class extends HTMLElement {
    connectedCallback() {
      this.setAttribute('aria-hidden', 'true');
      if (this.firstElementChild) return;
      this.innerHTML = '<svg viewBox="0 0 16 16" fill="none" focusable="false" aria-hidden="true"><path d="M3.5 6 8 10.5 12.5 6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg>';
    }
  });
  if (!customElements.get('sps-arrow-up-right')) customElements.define('sps-arrow-up-right', class extends HTMLElement {
    connectedCallback() {
      this.setAttribute('aria-hidden', 'true');
      if (this.firstElementChild) return;
      this.innerHTML = '<svg viewBox="0 0 20 20" fill="none" focusable="false" aria-hidden="true"><path d="M4.5 15.5 15.5 4.5M4.5 4.5h11v11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }
  });

  // Compact navigation pictogram: a single inherited color for breadcrumb use.
  if (!customElements.get('sps-home-pictogram')) customElements.define('sps-home-pictogram', class extends HTMLElement {
    connectedCallback() {
      this.setAttribute('aria-hidden', 'true');
      if (this.firstElementChild) return;
      this.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" focusable="false" aria-hidden="true"><path d="M4 10.5 12 4l8 6.5V20h-5v-6H9v6H4Z"/></svg>';
    }
  });

  // Small question-mark pictogram; the labelled button owns its tooltip semantics.
  if (!customElements.get('sps-help-pictogram')) customElements.define('sps-help-pictogram', class extends HTMLElement {
    connectedCallback() {
      this.setAttribute('aria-hidden', 'true');
      if (this.firstElementChild) return;
      this.innerHTML = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" focusable="false" aria-hidden="true"><circle cx="10" cy="10" r="8.5"/><path d="M7.8 7.6a2.2 2.2 0 0 1 4.4 0c0 1.4-2.2 1.7-2.2 3.3"/><circle cx="10" cy="14" r=".65" fill="currentColor" stroke="none"/></svg>';
    }
  });

  // Recreated from the archived first mega-menu: ink outlines, white forms,
  // one red accent and a pale token-based backdrop. Decorative, not evidence.
  if (!customElements.get('sps-service-pictogram')) customElements.define('sps-service-pictogram', class extends HTMLElement {
    connectedCallback() {
      this.setAttribute('aria-hidden', 'true');
      if (this.firstElementChild) return;
      const generatedAssets = {
        management: 'property-management-v1.png',
        marketing: 'leasing-marketing-v1.png',
        interior: 'interior-v1.png'
      };
      if (this.dataset.style === 'illustrated' && generatedAssets[this.dataset.service]) {
        this.innerHTML = `<img src="assets/jll-remix/services/${generatedAssets[this.dataset.service]}" alt="" width="1254" height="1254" decoding="async">`;
        return;
      }
      // Reference treatment: flat document symbols, square outlines, solid red areas.
      // Paths are native vectors so theme colors and small-size rendering stay consistent.
      const referencePictures = {
        management: '<path fill="var(--surface)" d="M47 15h53l19 19v65H47Z"/><path fill="var(--red)" d="M100 15v19h19Z"/><path d="M58 27h15m-15 9h34M65 61l18-14 18 14"/><path fill="var(--red)" d="m70 61 13-10 13 10v20H70Z"/><path d="M96 90h12M96 98h12"/><path fill="var(--surface)" d="M46 99h27l11 10-7 6-13-9H44m33 9h21l10-7h13v14H77l-18-12H44"/>',
        marketing: '<path fill="var(--surface)" d="m34 28 30-12 32 12 30-12v88l-30 12-32-12-30 12Z"/><path d="M64 16v88m32-76v88"/><path fill="var(--red)" d="m43 39 13-5v24l-13 5Zm30 41 14 5v21l-14-5Zm31-41 13-5v24l-13 5Z"/><path d="m43 74 13-5m-13 14 13-5m-13 14 8-3m29-45 13 5m-13 4 13 5m-13 4 13 5m17 7 13-5m-13 14 13-5m-13 14 8-3"/>',
        interior: '<path fill="var(--surface)" d="M33 24h62l17 17v66H33Z"/><path d="M95 24v17h17M45 39h23v27H45Zm0 39h23v17H45m35-42v42h20M68 82h12"/><path fill="var(--red)" d="M86 16h38v17H86Z"/><path d="M124 24h8v20h-27v14"/><path fill="var(--surface)" d="M100 58h10v26h-10Z"/>'
      };
      if (this.dataset.style === 'reference' && referencePictures[this.dataset.service]) {
        this.innerHTML = `<svg viewBox="0 0 160 128" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="square" stroke-linejoin="miter" focusable="false" aria-hidden="true">${referencePictures[this.dataset.service]}</svg>`;
        return;
      }
      const pictures = {
        rental: '<path fill="var(--surface)" d="M26 102V39l37-17 33 17v63Z"/><path d="M63 22v80M34 45l20-9m-20 24 20-9m-20 24 20-9m-20 24 20-9m20-39h13m-13 16h13m-13 16h13M91 102V76h31v26"/><path stroke="var(--red)" fill="var(--surface)" d="M106 76V57h18l10 9-10 10Z"/><circle cx="121" cy="66" r="1.7" fill="var(--red)" stroke="none"/>',
        facility: '<path fill="var(--surface)" d="M23 103V49h28v54m0 0V26h44v77Z"/><path d="M32 62h9m-9 13h9m-9 13h9M61 38h9m12 0h5M61 52h9m12 0h5M61 66h9m-9 14h9m-5 23V85h13v18"/><path fill="var(--surface)" d="m105 58 23 9v21c0 12-11 21-23 25-12-4-23-13-23-25V67Z"/><path stroke="var(--red)" stroke-width="2.8" d="m94 85 8 8 14-17"/>',
        accounting: '<rect fill="var(--surface)" x="20" y="29" width="100" height="67" rx="5"/><path d="M20 45h100M58 96v12m26-12v12m-36 0h47"/><circle cx="29" cy="37" r="1.5" fill="currentColor" stroke="none"/><circle cx="36" cy="37" r="1.5" fill="currentColor" stroke="none"/><path stroke="var(--red)" d="M33 80V66h13V55h13v25m12-23h27M71 67h17M71 78h21"/><rect fill="var(--surface)" x="104" y="63" width="29" height="42" rx="4"/><path stroke="var(--red)" stroke-width="2.8" d="m111 80 6 6 10-13"/><path d="M115 96h7"/><circle cx="128" cy="30" r="3.5" fill="var(--red)" stroke="none"/>',
        consulting: '<path fill="var(--surface)" d="M24 102V47l33-18 29 18v55Z"/><path d="M57 29v73M33 52l16-9m-16 24 16-9m-16 24 16-9m-16 24 16-9M66 52h12m-12 16h12"/><rect fill="var(--surface)" x="85" y="25" width="40" height="50" rx="2"/><path d="M94 38h20M94 47h16m-16 9h8"/><circle fill="var(--surface)" cx="104" cy="79" r="20"/><path stroke="var(--red)" stroke-width="3" d="m119 94 15 15m-39-30h18m-9-9v18"/>'
      };
      pictures.interior = '<path fill="var(--surface)" d="M25 109V27h75l34 29v53Z"/><path d="M100 27v82M25 109l31-22h44l34 22M37 40h25v26H37Z"/><path fill="var(--surface)" d="M49 93V69h43v24Z"/><path d="M44 81h10v17m33-17h10v17M49 93h43m-36 0v10m30-10v10"/><path stroke="var(--red)" d="M108 49h17v11h-17Zm17 5h6v15h-15v15"/>';
      // V1: one property context + one operational cue per service.
      // Same thin rounded outline and small red accents; no shared shield/search shorthand.
      const classicPictures = {
        management: '<path fill="var(--surface)" d="M25 105V37l35-15 29 15v68Z"/><path d="M60 22v83M34 43l17-7m-17 22 17-7m-17 22 17-7m-17 22 17-7M69 43h11m-11 15h11m-11 15h7M39 105V94l12-5v16"/><rect fill="var(--surface)" x="83" y="58" width="48" height="51" rx="2"/><rect fill="var(--surface)" x="98" y="53" width="18" height="10" rx="1"/><path stroke="var(--red)" stroke-width="2" d="m93 76 4 4 7-9"/><path d="M111 75h11M93 90h29m-29 10h13m9 0h7"/>',
        marketing: '<path fill="var(--surface)" d="M25 105V33h61v72Z"/><path d="M25 49h61M36 41h12m7 0h20M35 105V60h41v45M55 60v45m-20-18h20"/><path d="M60 80v8"/><path fill="var(--surface)" d="m83 88 5 18h10l-5-18Z"/><path fill="var(--surface)" d="M79 77h14l28-14v35L93 87H79Z"/><path d="M93 77v10M79 80h-5v5h5"/><path stroke="var(--red)" stroke-width="2" d="M121 63v35m11-18h9m-12-12 7-6m-7 30 7 6"/>',
        interior: '<path fill="var(--surface)" d="M25 108V28h69l40 27v53Z"/><path d="M94 28v59M25 108l28-21h41l40 21M35 41h19v23H35Z"/><path fill="var(--surface)" d="M48 83V64a3 3 0 0 1 3-3h34a3 3 0 0 1 3 3v19Z"/><path fill="var(--surface)" d="M44 78h10v13h28V78h10v21H44Z"/><path d="M68 61v30M50 99v7m36-7v7M54 84h28"/><rect fill="var(--surface)" stroke="var(--red)" x="106" y="47" width="22" height="11" rx="1"/><path stroke="var(--red)" d="M128 52h5v16h-17v12"/><rect fill="var(--surface)" x="113" y="80" width="6" height="17" rx="1"/>'
      };
      const pictureKey = { management: 'facility', marketing: 'consulting' }[this.dataset.service] || this.dataset.service;
      const artwork = (this.dataset.style === 'classic' && classicPictures[this.dataset.service]) || pictures[pictureKey] || pictures.rental;
      this.innerHTML = `<svg viewBox="0 0 160 128" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" focusable="false" aria-hidden="true">${this.dataset.style ? '' : '<path stroke="var(--line)" d="M17 113h128"/>'}${artwork}</svg>`;
    }
  });

  let serviceMenuId = 0;
  const serviceMenuFadeDuration = 220;
  if (!customElements.get('sps-service-menu')) customElements.define('sps-service-menu', class extends HTMLElement {
    connectedCallback() {
      if (this.firstElementChild) return;
      const id = `sps-services-${++serviceMenuId}`;
      const version = this.dataset.variant || document.documentElement.dataset.serviceMenu || 'v1';
      const variant = version === 'v4' ? 'v1' : version;
      const pictogramStyle = version === 'v4' ? 'reference' : 'classic';
      this.dataset.pictogram = pictogramStyle;
      this.dataset.variant = variant;
      const home = ['v2', 'v3', 'v4'].includes(version) ? `jll-remix-${version}.html` : 'jll-remix.html';
      // V1 explores broader service categories; V2/V3 retain their comparison content.
      const services = variant === 'v1' ? [
        ['management', '부동산 자산관리', '임대관리 · 시설관리 · 회계정산대행'],
        ['marketing', '임대 마케팅', '임대조건 분석 · 임차인 유치'],
        ['interior', '실내건축', '인테리어 · 리모델링 · 공간개선']
      ] : [
        ['rental', '임대관리', '임차인 응대 · 계약 일정 · 미납 대응'],
        ['facility', '시설관리', '시설 점검 · 보수 · 유지관리'],
        ['accounting', '회계정산대행', '청구 · 입출금 정리 · 정산 보고'],
        ['consulting', '임대차컨설팅', '임대 조건 검토 · 공실 · 임차인 유치']
      ];
      const expanded = {
        rental: ['임차인과 계약 일정, 입금과 미납 현황을 관리합니다.', ['임차인 요청 관리', '계약 일정 관리', '입금 확인과 미납 대응']],
        facility: ['점검부터 보수 대응까지, 건물의 일상적인 유지관리를 돕습니다.', ['점검과 유지관리', '보수와 현장 대응', '처리 현황 확인']],
        accounting: ['청구와 입출금 내역을 정리하고, 운영 비용을 정산합니다.', ['청구 내역 정리', '입출금과 비용 확인', '정산 보고']],
        consulting: ['공간의 조건을 검토하고, 공실과 다음 임대 계약을 준비합니다.', ['임대 조건 검토', '공실 해소 방향', '임차인 유치 지원']]
      };
      const content = variant === 'v3'
        ? `<div class="sps-service-intro"><p class="sps-service-kicker">SERVICES</p><h2>어떤 서비스가 <br>필요하신가요?</h2><p class="sps-service-intro-note">건물의 상황에 맞는<br>서비스를 살펴보세요.</p></div><div class="sps-service-cards">${services.map(([key, label, description]) => `<a class="sps-service-card" href="${home}?service=${key}#services" data-detail="${key}" aria-label="${label}"><span class="sps-service-art" data-art="${key}"><sps-service-pictogram data-service="${key}"></sps-service-pictogram></span><span class="sps-service-card-copy"><span class="sps-service-name"><span class="sps-service-title">${label}</span><sps-arrow-up-right></sps-arrow-up-right></span><span class="sps-service-description">${description}</span></span></a>`).join('')}</div>`
        : variant === 'v2'
        ? services.map(([key, label]) => `<div class="sps-service-column"><a class="sps-service-heading" href="${home}?service=${key}#services" data-detail="${key}">${label}<sps-chevron class="sps-chevron--next"></sps-chevron></a><p class="sps-service-summary">${expanded[key][0]}</p><ul class="sps-service-topics">${expanded[key][1].map((topic, index) => `<li><a href="${home}?service=${key}&section=${index}#services" data-detail="${key}" data-detail-section="${index}">${topic}</a></li>`).join('')}</ul></div>`).join('')
        : `<div class="sps-service-intro"><h2><span class="sps-service-question-line">어떤 서비스가</span> <br><span class="sps-service-question-line">필요하신가요?</span></h2></div><div class="sps-service-links">${services.map(([key, label, description]) => `<a class="sps-service-link" href="${home}?service=${key}#services" data-detail="${key}" aria-label="${label}"><span class="sps-service-link-copy"><span class="sps-service-name"><span class="sps-service-title">${label}</span><sps-arrow-up-right></sps-arrow-up-right></span><span class="sps-service-description">${description}</span></span><span class="sps-service-illustration"><sps-service-pictogram data-service="${key}" data-style="${pictogramStyle}"></sps-service-pictogram></span></a>`).join('')}</div>`;
      this.innerHTML = `<button class="sps-service-trigger" type="button" data-header-section="services" aria-expanded="false" aria-controls="${id}">서비스 <sps-chevron class="sps-chevron--nav"></sps-chevron></button>
        <div class="sps-service-panel" id="${id}" hidden><div class="sps-service-content">
          ${content}
        </div></div>`;
      this.trigger = this.querySelector('button');
      this.panel = this.querySelector('.sps-service-panel');
      this.content = this.querySelector('.sps-service-content');
      this.question = this.querySelector('.sps-service-intro h2');
      this.isOpen = false;
      this.trigger.addEventListener('click', event => {
        // Pointer entry may already have opened it before the click arrives.
        const keepHoverOpen = event.detail > 0 && this.openedByHover;
        this.openedByHover = false;
        this.setOpen(keepHoverOpen || !this.isOpen);
      });
      this.addEventListener('pointerenter', event => {
        if (event.pointerType === 'mouse' && !this.hasAttribute('data-mobile') && !this.isOpen) {
          this.openedByHover = true;
          this.setOpen(true);
        }
      });
      this.addEventListener('pointerleave', event => {
        // A mouse click leaves focus on the trigger. That focus must not pin
        // the disclosure open after the pointer leaves its whole region.
        if (event.pointerType === 'mouse' && !this.hasAttribute('data-mobile')) {
          this.close(true);
        }
      });
      this.addEventListener('focusout', event => {
        if (!this.contains(event.relatedTarget)) this.close();
      });
      this.addEventListener('keydown', event => {
        if (event.key === 'Escape' && this.isOpen) {
          event.preventDefault(); event.stopPropagation(); this.close(true);
        } else if (event.key === 'ArrowDown' && event.target === this.trigger) {
          event.preventDefault(); this.setOpen(true); this.panel.querySelector('a').focus();
        }
      });
      this.addEventListener('click', event => {
        if (event.target.closest('a')) this.close(true);
      });
      this.outsideClick = event => { if (!this.contains(event.target)) this.close(); };
      document.addEventListener('click', this.outsideClick);
      // Comparison-only entry state; normal navigation still starts closed.
      const review = new URLSearchParams(location.search);
      if (review.has('embed') && review.get('menu') === 'services' && !this.hasAttribute('data-mobile') && !matchMedia('(max-width:850px)').matches) this.setOpen(true);
    }
    disconnectedCallback() { this.fade?.cancel(); this.questionMotion?.cancel(); document.removeEventListener('click', this.outsideClick); }
    setOpen(open) {
      if (this.isOpen === open) return;
      // Read the current visual opacity before cancelling so a quick return
      // reverses the fade without a flash or an extra waiting period.
      const from = this.panel.hidden ? 0 : Number(getComputedStyle(this.panel).opacity);
      this.fade?.cancel();
      this.fade = null;
      this.isOpen = open;
      if (!open) this.openedByHover = false;
      this.trigger.setAttribute('aria-expanded', String(open));
      this.panel.setAttribute('aria-hidden', String(!open));
      this.content.inert = !open;
      this.panel.hidden = false;
      this.panel.style.opacity = open ? '1' : '0';
      const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducedMotion) this.questionMotion?.cancel();
      // Move the complete heading visually; its two-line baseline and layout stay fixed.
      // A quick return during the panel fade continues the existing entrance.
      if (open && from === 0 && this.question && !reducedMotion) {
        this.questionMotion?.cancel();
        const motion = this.question.animate([
          { opacity: 0, transform: 'translateY(8px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], {
          duration: 420,
          easing: getComputedStyle(this).getPropertyValue('--ease-editorial').trim() || 'cubic-bezier(.22,1,.36,1)'
        });
        this.questionMotion = motion;
        motion.onfinish = () => { if (this.questionMotion === motion) this.questionMotion = null; };
      }
      if (reducedMotion || from === Number(open)) {
        this.panel.hidden = !open;
        return;
      }
      const fade = this.panel.animate([{ opacity: from }, { opacity: Number(open) }], {
        duration: serviceMenuFadeDuration * Math.abs(Number(open) - from),
        easing: 'ease-out', fill: 'both'
      });
      this.fade = fade;
      fade.onfinish = () => {
        if (this.fade !== fade) return;
        this.panel.hidden = !this.isOpen;
        this.fade = null;
        fade.cancel();
      };
    }
    close(returnFocus = false) {
      if (!this.panel || !this.isOpen) return;
      if (returnFocus && this.contains(document.activeElement)) this.trigger.focus();
      this.setOpen(false);
    }
  });
})();
