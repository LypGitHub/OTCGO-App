import { Component } from '@angular/core'
import {
  IonicPage, LoadingController, NavController,
  NavParams
} from 'ionic-angular'
import { LoginPage } from '../login/login'

import { wallet } from '../../libs/neon'
import { WalletProvider } from '../../providers/wallet/wallet.provider'
import { BackupWalletPage } from './backup-wallet/backup-wallet'
import { debug } from '../../shared/utils'
import { TranslateService } from '@ngx-translate/core'
import { NotificationProvider } from '../../providers/notification.provider'

@IonicPage({
  name: 'CreateWallet',
  segment: 'create-wallet'
})
@Component({
  selector: 'page-create-wallet',
  templateUrl: 'create-wallet.html',
})
export class CreateWalletPage {
  loginPage = LoginPage
  backupWalletPage = BackupWalletPage
  private protocolAgreement: boolean = false
  private wif: string
  private name: string
  private passphrase1: string
  private passphrase2: string

  private passphraseLengthError: string
  private wifError: string

  constructor (
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private walletProvider: WalletProvider,
    private notificationProvider: NotificationProvider,
    private translateService: TranslateService
  ) {
    this.translateService.onLangChange.subscribe(value => {
      debug('onLangChange')(value)

    })
  }

  get disabledButton () {
    if (this.wif)
      return !this.passphrase1 || !this.passphrase2 ||
        (this.passphrase1 !== this.passphrase2) ||
        !this.name ||
        !this.protocolAgreement || !this.wif
    return !this.passphrase1 || !this.passphrase2 ||
      (this.passphrase1 !== this.passphrase2) ||
      !this.name ||
      !this.protocolAgreement
  }

  async createWallet () {
    if (this.passphrase1 &&
       !this.validatePassphraseStrength(this.passphrase1))
      this.notificationProvider.emit({ message: 'Password too short' })

    if (this.passphrase1 !== this.passphrase2) return

    if (this.wif && !wallet.isWIF(this.wif))
      return this.notificationProvider.emit({ message: 'Password too short' })

    let i = await this.createLoading('Creating wallet!')

    await i.present()

    try {
      const accountTemp = new wallet.Account(
        this.wif || wallet.generatePrivateKey())
      const { WIF, address } = accountTemp
      const encryptedWIF = wallet.encrypt(WIF, this.passphrase1)

      const account = new wallet.Account({
        address,
        label: this.name,
        isDefault: true,
        lock: false,
        key: encryptedWIF,
        contract: null,
        extra: null
      } as any)

      this.walletProvider.addAccount(account)
      this.walletProvider.saveWallet()

      await i.dismiss()
      await this.navCtrl.push(this.backupWalletPage)
    } catch (e) {
      console.log(e)
      this.notificationProvider.emit({ message: e })
    }

  }

  validatePassphraseStrength (passphrase) {
    return passphrase.length >= 4
  }

  createLoading (content) {
    const loading = this.loadingCtrl.create({
      content,
      spinner: 'crescent'
    })

    return Promise.resolve(loading)
  }
}
