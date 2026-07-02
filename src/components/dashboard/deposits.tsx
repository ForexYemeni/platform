'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Copy, Check, QrCode, ArrowDownRight, Clock, CheckCircle2, AlertCircle, Bitcoin } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { cryptos, mockTransactions } from '@/lib/data'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import QRCode from '@/components/ui/qrcode'

export function DepositsPage() {
  const { lang } = useAppStore()
  const isRtl = lang === 'ar'
  const [selectedCrypto, setSelectedCrypto] = useState(cryptos[2]) // USDT TRC20
  const [amount, setAmount] = useState('')
  const [copied, setCopied] = useState(false)
  const [step, setStep] = useState<'select' | 'address' | 'waiting'>('select')

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedCrypto.address)
    setCopied(true)
    toast.success(isRtl ? 'تم نسخ العنوان!' : 'Address copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleGenerate = () => {
    if (!amount || parseFloat(amount) < selectedCrypto.minDeposit) {
      toast.error(isRtl ? `الحد الأدنى للإيداع ${selectedCrypto.minDeposit} ${selectedCrypto.symbol}` : `Minimum deposit is ${selectedCrypto.minDeposit} ${selectedCrypto.symbol}`)
      return
    }
    setStep('address')
  }

  const handleConfirmSent = () => {
    setStep('waiting')
    toast.success(isRtl ? 'في انتظار التأكيد...' : 'Awaiting confirmation...')
    setTimeout(() => {
      toast.success(isRtl ? 'تم تأكيد الإيداع!' : 'Deposit confirmed!')
      setStep('select')
      setAmount('')
    }, 5000)
  }

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <h1 className="text-2xl md:text-3xl font-bold mb-1">
          {isRtl ? 'إيداع الأموال' : 'Deposit Funds'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isRtl ? 'أودع بأي عملة مدعومة، يتم التأكيد تلقائياً' : 'Deposit with any supported currency, auto-confirmed'}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deposit form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card className="p-6 glass border-white/5">
            {/* Steps indicator */}
            <div className="flex items-center justify-between mb-6">
              {[
                { num: 1, label: isRtl ? 'اختر العملة' : 'Select Coin', active: step === 'select' },
                { num: 2, label: isRtl ? 'العنوان' : 'Address', active: step === 'address' },
                { num: 3, label: isRtl ? 'التأكيد' : 'Confirm', active: step === 'waiting' },
              ].map((s, i) => (
                <div key={i} className="flex items-center flex-1">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    s.active || (step === 'address' && s.num === 1) || (step === 'waiting' && s.num < 3)
                      ? 'bg-gradient-to-r from-[#00d4ff] to-[#9d4edd] text-white'
                      : 'glass text-muted-foreground'
                  }`}>
                    {s.num}
                  </div>
                  <span className={`ms-2 text-xs ${s.active ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                    {s.label}
                  </span>
                  {i < 2 && <div className="flex-1 h-0.5 bg-border mx-3" />}
                </div>
              ))}
            </div>

            {step === 'select' && (
              <>
                {/* Crypto selection */}
                <Label className="mb-3 block">{isRtl ? 'اختر العملة' : 'Select Currency'}</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
                  {cryptos.map((crypto) => (
                    <button
                      key={crypto.id}
                      onClick={() => setSelectedCrypto(crypto)}
                      className={`p-3 rounded-xl border transition-all text-start ${
                        selectedCrypto.id === crypto.id
                          ? 'border-[#00d4ff] bg-[#00d4ff]/10'
                          : 'border-white/5 glass hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                          style={{ background: crypto.color }}
                        >
                          {crypto.icon}
                        </span>
                        <div className="min-w-0">
                          <div className="font-semibold text-sm truncate">{crypto.symbol}</div>
                          <div className="text-[10px] text-muted-foreground truncate">{crypto.network}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Amount input */}
                <div className="space-y-2 mb-4">
                  <Label>{isRtl ? 'المبلغ' : 'Amount'}</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder={`Min: ${selectedCrypto.minDeposit}`}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="bg-white/5 pe-20"
                    />
                    <div className="absolute top-1/2 -translate-y-1/2 end-3 text-sm font-medium text-muted-foreground">
                      {selectedCrypto.symbol}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{isRtl ? 'الحد الأدنى' : 'Minimum'}: {selectedCrypto.minDeposit} {selectedCrypto.symbol}</span>
                    <span>≈ ${((parseFloat(amount) || 0) * selectedCrypto.price).toFixed(2)} USD</span>
                  </div>
                </div>

                {/* Info */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  <div className="p-3 rounded-xl glass text-center">
                    <div className="text-xs text-muted-foreground">{isRtl ? 'الرسوم' : 'Fee'}</div>
                    <div className="font-bold text-emerald-400">0%</div>
                  </div>
                  <div className="p-3 rounded-xl glass text-center">
                    <div className="text-xs text-muted-foreground">{isRtl ? 'التأكيدات' : 'Confirmations'}</div>
                    <div className="font-bold">3</div>
                  </div>
                  <div className="p-3 rounded-xl glass text-center">
                    <div className="text-xs text-muted-foreground">{isRtl ? 'المدة' : 'Duration'}</div>
                    <div className="font-bold">~5 min</div>
                  </div>
                </div>

                <Button
                  onClick={handleGenerate}
                  className="w-full h-12 bg-gradient-to-r from-[#00d4ff] to-[#9d4edd] text-white border-0 glow-electric"
                >
                  {isRtl ? 'إنشاء عنوان الإيداع' : 'Generate Deposit Address'}
                </Button>
              </>
            )}

            {step === 'address' && (
              <>
                <div className="text-center mb-6">
                  <div className="inline-block p-4 rounded-2xl bg-white mb-4">
                    <QRCode value={selectedCrypto.address} size={180} />
                  </div>
                  <Badge className="bg-[#00d4ff]/10 text-[#00d4ff] border-0 mb-2">
                    {selectedCrypto.name} • {selectedCrypto.network}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <Label>{isRtl ? 'عنوان الإيداع' : 'Deposit Address'}</Label>
                  <div className="flex gap-2">
                    <Input
                      readOnly
                      value={selectedCrypto.address}
                      className="bg-white/5 font-mono text-sm"
                    />
                    <Button onClick={handleCopy} className="flex-shrink-0">
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-200/80 space-y-1">
                      <p className="font-medium">{isRtl ? 'تنبيه مهم:' : 'Important:'}</p>
                      <p>{isRtl ? `أرسل فقط ${selectedCrypto.symbol} على شبكة ${selectedCrypto.network} إلى هذا العنوان.` : `Send only ${selectedCrypto.symbol} on ${selectedCrypto.network} network to this address.`}</p>
                      <p>{isRtl ? 'إرسال عملة أخرى سيؤدي إلى فقدان أموالك.' : 'Sending other coins will result in permanent loss.'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep('select')}
                    className="flex-1 glass"
                  >
                    {isRtl ? 'رجوع' : 'Back'}
                  </Button>
                  <Button
                    onClick={handleConfirmSent}
                    className="flex-1 bg-gradient-to-r from-[#00d4ff] to-[#9d4edd] text-white border-0"
                  >
                    {isRtl ? 'لقد أرسلت الدفعة' : "I've Sent Payment"}
                  </Button>
                </div>
              </>
            )}

            {step === 'waiting' && (
              <div className="text-center py-12">
                <div className="inline-flex w-20 h-20 rounded-full bg-[#00d4ff]/10 items-center justify-center mb-4">
                  <Clock className="h-10 w-10 text-[#00d4ff] animate-pulse" />
                </div>
                <h3 className="text-xl font-bold mb-2">{isRtl ? 'في انتظار التأكيد...' : 'Awaiting Confirmation...'}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {isRtl ? 'يتم مراقبة البلوكتشين للتأكد من وصول دفعتك' : 'Monitoring blockchain for your payment'}
                </p>
                <div className="max-w-xs mx-auto">
                  <div className="flex justify-between text-xs text-muted-foreground mb-2">
                    <span>{isRtl ? 'الحالة' : 'Status'}</span>
                    <span>0/3 {isRtl ? 'تأكيد' : 'confirmations'}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#00d4ff] to-[#9d4edd]"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 5 }}
                    />
                  </div>
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Sidebar info */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <Card className="p-5 glass border-white/5">
            <h3 className="font-bold mb-3">{isRtl ? 'معلومات سريعة' : 'Quick Info'}</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{isRtl ? 'رسوم الإيداع' : 'Deposit Fee'}</span>
                <span className="font-semibold text-emerald-400">{isRtl ? 'مجاني' : 'Free'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{isRtl ? 'الحد الأدنى' : 'Minimum'}</span>
                <span className="font-semibold">{selectedCrypto.minDeposit} {selectedCrypto.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{isRtl ? 'وقت المعالجة' : 'Processing Time'}</span>
                <span className="font-semibold">5-30 min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{isRtl ? 'التأكيدات' : 'Confirmations'}</span>
                <span className="font-semibold">3 blocks</span>
              </div>
            </div>
          </Card>

          <Card className="p-5 glass border-[#9d4edd]/20 bg-gradient-to-br from-[#9d4edd]/5 to-transparent">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <Bitcoin className="h-4 w-4 text-[#9d4edd]" />
              {isRtl ? 'لماذا الإيداع بـ USDT TRC20؟' : 'Why USDT TRC20?'}
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>{isRtl ? 'رسوم منخفضة جداً (~$1)' : 'Very low fees (~$1)'}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>{isRtl ? 'تأكيد سريع خلال ثوانٍ' : 'Fast confirmation in seconds'}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>{isRtl ? 'قيمة مستقرة 1:1 مع الدولار' : 'Stable 1:1 with USD'}</span>
              </li>
            </ul>
          </Card>
        </motion.div>
      </div>

      {/* Deposit history */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-5 glass border-white/5">
          <h3 className="font-bold mb-4">{isRtl ? 'سجل الإيداعات' : 'Deposit History'}</h3>
          <div className="overflow-x-auto scrollbar-luxury">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-start text-xs text-muted-foreground border-b border-border">
                  <th className="text-start font-medium pb-3 ps-2">{isRtl ? 'العملة' : 'Currency'}</th>
                  <th className="text-start font-medium pb-3">{isRtl ? 'المبلغ' : 'Amount'}</th>
                  <th className="text-start font-medium pb-3 hidden md:table-cell">{isRtl ? 'الشبكة' : 'Network'}</th>
                  <th className="text-start font-medium pb-3 hidden md:table-cell">{isRtl ? 'التاريخ' : 'Date'}</th>
                  <th className="text-start font-medium pb-3">{isRtl ? 'الحالة' : 'Status'}</th>
                </tr>
              </thead>
              <tbody>
                {mockTransactions.filter(t => t.type === 'deposit').map((tx) => {
                  const crypto = cryptos.find(c => c.symbol === tx.currency) || cryptos[0]
                  return (
                    <tr key={tx.id} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                      <td className="py-3 ps-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
                            style={{ background: crypto.color }}
                          >
                            {crypto.icon}
                          </span>
                          <span className="font-medium">{tx.currency}</span>
                        </div>
                      </td>
                      <td className="py-3 font-semibold text-emerald-400">+{tx.amount} {tx.currency}</td>
                      <td className="py-3 hidden md:table-cell text-muted-foreground">{crypto.network}</td>
                      <td className="py-3 hidden md:table-cell text-muted-foreground">{tx.date}</td>
                      <td className="py-3">
                        <Badge
                          variant="outline"
                          className={
                            tx.status === 'completed' ? 'border-emerald-500/30 text-emerald-400' :
                            tx.status === 'pending' ? 'border-amber-500/30 text-amber-400' :
                            'border-red-500/30 text-red-400'
                          }
                        >
                          {tx.status === 'completed' ? (isRtl ? 'مكتمل' : 'Completed') :
                           tx.status === 'pending' ? (isRtl ? 'معلق' : 'Pending') :
                           (isRtl ? 'مرفوض' : 'Rejected')}
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
