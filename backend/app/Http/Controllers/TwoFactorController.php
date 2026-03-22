<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Laravel\Fortify\Actions\ConfirmTwoFactorAuthentication;
use Laravel\Fortify\Actions\DisableTwoFactorAuthentication;
use Laravel\Fortify\Actions\EnableTwoFactorAuthentication;
use Laravel\Fortify\Actions\GenerateNewRecoveryCodes;

class TwoFactorController extends Controller
{
    public function status(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'enabled' => ! is_null($user->two_factor_secret),
            'confirmed' => ! is_null($user->two_factor_confirmed_at),
        ]);
    }

    public function enable(Request $request, EnableTwoFactorAuthentication $enable): JsonResponse
    {
        $enable($request->user());

        AuditLog::record('updated', '2FA enabled', 'User', $request->user()->id, $request->user()->id, $request->ip());

        return response()->json([
            'message' => 'Two-factor authentication enabled.',
        ]);
    }

    public function confirm(Request $request, ConfirmTwoFactorAuthentication $confirm): JsonResponse
    {
        $request->validate(['code' => 'required|string']);

        $confirm($request->user(), $request->code);

        AuditLog::record('updated', '2FA confirmed and activated', 'User', $request->user()->id, $request->user()->id, $request->ip());

        return response()->json(['message' => 'Two-factor authentication confirmed.']);
    }

    public function disable(Request $request, DisableTwoFactorAuthentication $disable): JsonResponse
    {
        $disable($request->user());

        AuditLog::record('updated', '2FA disabled', 'User', $request->user()->id, $request->user()->id, $request->ip());

        return response()->json(['message' => 'Two-factor authentication disabled.']);
    }

    public function qrCode(Request $request): JsonResponse
    {
        $user = $request->user();

        if (is_null($user->two_factor_secret)) {
            return response()->json(['message' => '2FA not enabled.'], 400);
        }

        return response()->json([
            'svg' => $user->twoFactorQrCodeSvg(),
            'url' => $user->twoFactorQrCodeUrl(),
        ]);
    }

    public function recoveryCodes(Request $request): JsonResponse
    {
        $user = $request->user();

        if (is_null($user->two_factor_secret)) {
            return response()->json(['message' => '2FA not enabled.'], 400);
        }

        return response()->json([
            'codes' => json_decode(decrypt($user->two_factor_recovery_codes), true),
        ]);
    }
}
