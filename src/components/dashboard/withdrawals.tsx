'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { ArrowUpRight, Wallet, AlertCircle, CheckCircle2, Clock, Send } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { cryptos, mockTransactions } from '@/lib/data'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export function WithdrawalsPage() {
  const { lang, user } = useAppStore()
  const isRtl = lang === 'ar'
  const [selectedCrypto, setSelectedCrypto] = useState(cryptos[2])
  const [address, setAddress] = useState('')
  const [amount, setAmount] = useState('')

  const balance = user?.balance || 4520.50
  const fee = selectedCrypto.withdrawFee
  const youReceive = parseFloat(amount) ? Math.max(0, parseFloat(amount) - fee) : 0

  const handleSubmit = () => {
    if (!address) {
      toast.error(isRtl ? 'أدخل عنوان الاستلام' : 'Enter receiving address')
      return
    }
    if (!amount || parseFloat(amount) < selectedCrypto.minWithdraw) {
      toast.error(isRtl ? `الحد الأدنى ${selectedCrypto.minWithdraw} ${selectedCrypto.symbol}` : `Minimum is ${selectedCrypto.minWithdraw} ${selectedCrypto.symbol}`)
      return
    }
    if (parseFloat(amount) > balance) {
      toast.error(isRtl ? 'الرصيد غير كافٍ' : 'Insufficient balance')
      return
    }
    toast.success(isRtl ? 'تم إرسال طلب السحب!' : 'Withdrawal request submitted!')
    setAddress('')
    setAmount('')
  }

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <h1 className="text-2xl md:text-3xl font-bold mb-1">
          {isRtl ? 'سحب الأموال' : 'Withdraw Funds'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isRtl ? 'اسحب أرباحك في أي وقت، معالجة فورية' : 'Withdraw your profits anytime, instant processing'}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Withdrawal form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card className="p-6 glass border-white/5">
            {/* Balance */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-[#00d4ff]/10 to-[#9d4edd]/10 border border-white/5 mb-6">
              <div>
                <div className="text-xs text-muted-foreground mb-1">{isRtl ? 'الرصيد المتاح' : 'Available Balance'}</div>
                <div className="text-2xl font-black text-gradient-electric">
                  ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00d4ff] to-[#9d4edd] flex items-center justify-center">
                <Wallet className="h-6 w-6 text-white" />
              </div>
            </div>

            {/* Crypto selection */}
            <Label className="mb-3 block">{isRtl ? 'اختر العملة' : 'Select Currency'}</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
              {cryptos.map((crypto) => (
                <button
                  key={crypto.id}
                  onClick={() => setSelectedCrypto(crypto)}
                  className={`p-3 rounded-xl border transition-all text-start ${
                    selectedCrypto.id === crypto.id
                      ? 'border-[#9d4edd] bg-[#9d4edd]/10'
                      : 'border-white/5 glass hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2">
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

            {/* Receiving address */}
            <div className="space-y-2 mb-4">
              <Label>{isRtl ? 'عنوان الاستلام' : 'Receiving Address'}</Label>
              <Input
                placeholder={isRtl ? `أدخل عنوان ${selectedCrypto.symbol} الخاص بك` : `Enter your ${selectedCrypto.symbol} address`}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="bg-white/5 font-mono text-sm"
              />
            </div>

            {/* Amount */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <Label>{isRtl ? 'المبلغ' : 'Amount'}</Label>
                <button
                  onClick={() => setAmount(String(balance / selectedCrypto.price))}
                  className="text-xs text-[#00d4ff] hover:underline"
                >
                  {isRtl ? 'الحد الأقصى' : 'MAX'}
                </button>
              </div>
              <div className="relative">
                <Input
                  type="number"
                  placeholder={`Min: ${selectedCrypto.minWithdraw}`}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-white/5 pe-20"
                />
                <div className="absolute top-1/2 -translate-y-1/2 end-3 text-sm font-medium text-muted-foreground">
                  {selectedCrypto.symbol}
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{isRtl ? 'الحد الأدنى للسحب' : 'Min Withdrawal'}: {selectedCrypto.minWithdraw} {selectedCrypto.symbol}</span>
                <span>≈ ${((parseFloat(amount) || 0) * selectedCrypto.price).toFixed(2)} USD</span>
              </div>
            </div>

            {/* Fee breakdown */}
            <div className="p-4 rounded-xl glass space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{isRtl ? 'المبلغ المطلوب' : 'Requested Amount'}</span>
                <span className="font-medium">{parseFloat(amount) || 0} {selectedCrypto.symbol}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{isRtl ? 'رسوم الشبكة' : 'Network Fee'}</span>
                <span className="font-medium text-red-400">-{fee} {selectedCrypto.symbol}</span>
              </div>
              <div className="h-px bg-border my-2" />
              <div className="flex justify-between text-sm">
                <span className="font-medium">{isRtl ? 'ستستقبل' : 'You Will Receive'}</span>
                <span className="font-bold text-emerald-400">{youReceive.toFixed(6)} {selectedCrypto.symbol}</span>
              </div>
            </div>

            {/* Warning */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-200/80">
                  {isRtl
                    ? `تأكد من صحة العنوان. السحب لا يمكن التراجع عنه. أرسل فقط ${selectedCrypto.symbol} على شبكة ${selectedCrypto.network}.`
                    : `Double-check the address. Withdrawals are irreversible. Send only ${selectedCrypto.symbol} on ${selectedCrypto.network} network.`}
                </p>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full h-12 bg-gradient-to-r from-[#9d4edd] to-[#00d4ff] text-white border-0 glow-purple"
            >
              <Send className="h-4 w-4 me-2 rtl:rotate-180" />
              {isRtl ? 'إرسال طلب السحب' : 'Submit Withdrawal Request'}
            </Button>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <Card className="p-5 glass border-white/5">
            <h3 className="font-bold mb-3">{isRtl ? 'معلومات السحب' : 'Withdrawal Info'}</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{isRtl ? 'الحد الأدنى' : 'Minimum'}</span>
                <span className="font-semibold">{selectedCrypto.minWithdraw} {selectedCrypto.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{isRtl ? 'الرسوم' : 'Fee'}</span>
                <span className="font-semibold">{selectedCrypto.withdrawFee} {selectedCrypto.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{isRtl ? 'وقت المعالجة' : 'Processing'}</span>
                <span className="font-semibold text-emerald-400">{isRtl ? 'فوري' : 'Instant'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{isRtl ? 'الحد اليومي' : 'Daily Limit'}</span>
                <span className="font-semibold">$10,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{isRtl ? 'الحد الشهري' : 'Monthly Limit'}</span>
                <span className="font-semibold">$100,000</span>
              </div>
            </div>
          </Card>

          <Card className="p-5 glass border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <h3 className="font-bold">{isRtl ? 'سحب سريع وموثوق' : 'Fast & Secure'}</h3>
            </div>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span>{isRtl ? 'معالجة تلقائية خلال 5 دقائق' : 'Automatic processing within 5 min'}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span>{isRtl ? 'مراجعة أمنية للسحوبات الكبيرة' : 'Security review for large withdrawals'}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span>{isRtl ? 'تأكيد عبر البريد والـ 2FA' : 'Email and 2FA confirmation'}</span>
              </li>
            </ul>
          </Card>
        </motion.div>
      </div>

      {/* History */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-5 glass border-white/5">
          <h3 className="font-bold mb-4">{isRtl ? 'سجل السحوبات' : 'Withdrawal History'}</h3>
          <div className="overflow-x-auto scrollbar-luxury">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground border-b border-border">
                  <th className="text-start font-medium pb-3 ps-2">{isRtl ? 'العملة' : 'Currency'}</th>
                  <th className="text-start font-medium pb-3">{isRtl ? 'المبلغ' : 'Amount'}</th>
                  <th className="text-start font-medium pb-3 hidden md:table-cell">{isRtl ? 'العنوان' : 'Address'}</th>
                  <th className="text-start font-medium pb-3 hidden md:table-cell">{isRtl ? 'التاريخ' : 'Date'}</th>
                  <th className="text-start font-medium pb-3">{isRtl ? 'الحالة' : 'Status'}</th>
                </tr>
              </thead>
              <tbody>
                {mockTransactions.filter(t => t.type === 'withdrawal').concat([
                  { id: 'w2', type: 'withdrawal' as const, amount: 100, currency: 'USDT', status: 'completed' as const, date: '2026-06-28 10:30', txHash: '0x1234...abcd' },
                  { id: 'w3', type: 'withdrawal' as const, amount: 0.005, currency: 'BTC', status: 'completed' as const, date: '2026-06-25 14:20', txHash: 'bc1q...xyz' },
                ]).map((tx) => {
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
                      <td className="py-3 font-semibold text-red-400">-{tx.amount} {tx.currency}</td>
                      <td className="py-3 hidden md:table-cell text-muted-foreground font-mono text-xs">
                        {(tx.txHash || '0xabcd...1234').slice(0, 14)}...
                      </td>
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
